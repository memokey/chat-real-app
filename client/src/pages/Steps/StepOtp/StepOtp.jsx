import React, { Fragment, useState } from 'react'
import Button from '../../../components/shared/Button/Button'
import Card from '../../../components/shared/Card/Card'
import Textinput from '../../../components/shared/Textinput/Textinput'
import styles from './StepOtp.module.css'
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify'
import { verifyOtp } from '../../../helper/http';
import { setAuth } from '../../../store/auth.slice'


export default function StepOtp({ onNext }) {
    const dispatch = useDispatch();
    const [otp, setOtp] = useState('');
    const { hash, phone } = useSelector(state => state.auth.otp);
    const submit = async () => {
        if(!otp){
            toast.error("otp is required")
            return;
        }
        try {
            const { data } = await verifyOtp({ hash, phone, otp });
            dispatch(setAuth(data))

            // onNext();
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

    return (
        <Fragment>
            <div className={styles.cardWrapper}>
                <Card
                    title="Enter the code we just texted you"
                    icon="lock-emoji"
                >
                    <Textinput
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <div className={styles.actionButtonWrap}>
                        <Button onClick={submit} label="Next" />
                    </div>
                    <p className={styles.bottomParagraph}>
                        By entering your number, you’re agreeing to our Terms of
                        Service and Privacy Policy. Thanks!
                    </p>
                </Card>
            </div>
        </Fragment>
    )
}
