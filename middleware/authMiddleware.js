const tokenService = require('../services/token-service');

module.exports = async function (req, res, next) {
    try {
        const { accesstoken } = req.cookies;
        if (!accesstoken) {
            throw new Error();
        }

        const userData = await tokenService.verifyAccessToken(accesstoken);

        if (!userData) {
            throw new Error();
        }
        req.user = userData;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};
