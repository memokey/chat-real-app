const { hashOtp } = require('../services/hashService');
const OtpService = require('../services/otp-service');
const userService = require('../services/user-service');
const tokenService = require('../services/token-service');
const UserDao = require('../dtos/user-dto');

class AuthController {
    async sendOtp(req, res) {
        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({ message: 'Invalid phone number' })
        }
        let OTP = await OtpService.generateOtp();
        console.log(OTP);

        try {
            // await OtpService.sendOtpToUser(phone,OTP);

            if (OTP) {
                let till = 1000 * 60 * 60;
                let expires = Date.now() + till;

                let hash = `${phone}.${OTP}.${expires}`;
                hash = hashOtp(hash);
                return res.status(200).json({ message: 'Otp sent successfully', hash: `${hash}.${expires}` })

            } else {
                return res.status(400).json({ message: 'Unable to send otp' })
            }
        } catch (error) {
            res.status(500).json({ message: 'message sending failed' });
        }
    }

    async verifyOtp(req, res) {
        const { otp, hash, phone } = req.body;
        if (!otp || !hash || !phone) {
            return res.status(400).json({ message: 'All fields are required!', auth: false });
        }

        const [hashedOtp, expires] = hash.split('.');
        if (Date.now() > +expires) {
            return res.status(400).json({ message: 'OTP expired!', auth: false });
        }

        const data = `${phone}.${otp}.${expires}`;

        const isValid = OtpService.verifyOtp(hashedOtp, data);
        if (!isValid) {
            return res.status(400).json({ message: 'Invalid OTP', auth: false });
        }

        try {
            let user = await userService.findUser({ phone });
            if (!user) {
                user = await userService.createUser({ phone });
            }

            const { accessToken, refreshToken } = tokenService.generateTokens({ _id: user._id, activated: user.activated });

            await tokenService.storeRefreshToken(refreshToken, user._id);

            res.cookie('refreshtoken', refreshToken, {
                maxAge: 1000 * 60 * 60 * 24 * 30,
                httpOnly: true,
            })

            res.cookie('accesstoken', accessToken, {
                maxAge: 1000 * 60 * 60 * 24 * 30,
                httpOnly: true,
            })

            const userDtoObje = new UserDao(user);
            return res.status(200).json({ message: 'operation successfully', auth: true, user: userDtoObje })
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: 'Somethiing went wrong', auth: false, error })
        }
    }

    async refresh(req, res) {
        const { refreshtoken } = req.cookies;
        let userData;
        let user;

        try {
            userData = await tokenService.verifyRefreshToken(refreshtoken);
        } catch (error) {
            return res.status(401).json({ message: 'Invalid token', auth: false, error })
        }

        try {
            const token = await tokenService.findRefreshToken(userData._id, refreshtoken);
            if (!token) {
                return res.status(401).json({ message: 'Invalid token', auth: false })
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal error', auth: false, error })
        }

        // check is user valid
        try {
            user = await userService.findUser({ _id: userData._id });
            if (!user) {
                return res.status(404).json({ message: 'user not found', auth: false, error })
            }
        } catch (error) {
            return res.status(500).json({ message: 'Internal error', auth: false, error })
        }

        const { accessToken, refreshToken } = tokenService.generateTokens({ _id: user._id, activated: user.activated });

        try {
            await tokenService.updateRefreshToken(user._id, refreshToken);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal error', auth: false, error })
        }

        res.cookie('refreshtoken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
        })

        res.cookie('accesstoken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
        })

        const userDtoObje = new UserDao(user);
        return res.status(200).json({ message: 'operation successfully', auth: true, user: userDtoObje })
    }

    async logout(req, res) {
        const { refreshtoken } = req.cookies;
        // delete refresh token from db
        await tokenService.removeToken(refreshtoken);
        // delete cookies
        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');
        res.json({ user: null, auth: false });
    }

}


module.exports = new AuthController();