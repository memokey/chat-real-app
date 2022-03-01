import React, { Fragment, useState } from 'react'
import Button from '../../../../components/shared/Button/Button';
import Textinput from '../../../../components/shared/Textinput/Textinput'
import Card from '../../../../components/shared/Card/Card';
import style from '../EmailPhone.module.css';
import { sendOtp } from '../../../../helper/http';
import {toast } from 'react-toastify';
import {useDispatch} from 'react-redux';
import { setOtp } from '../../../../store/auth.slice';

export default function Phone({onNext}) {
    const [phoneNumber, setphoneNumber] = useState('');
    const dispatch = useDispatch();

    const submit = async ()=>{
        if(!phoneNumber){
            toast.error("Phone number is required")
            return;
        }
        const {data} = await sendOtp({phone:phoneNumber});
        dispatch(setOtp({hash:data.hash,phone:phoneNumber}));
        toast.success("Otp send successfully")
        onNext();
    }

  return (
    <Fragment>
        <Card title="Enter your phone number" icon="phone">
        <Textinput value={phoneNumber} onChange={(e) => setphoneNumber(e.target.value)} type="text"  />
            <div>
                <div className={style.actionButtonWrap}>
                    <Button label="Next" onClick={submit} />
                </div>
                <p className={style.bottomParagraph}>
                    By entering your number, you’re agreeing to our Terms of
                    Service and Privacy Policy. Thanks!
                </p>
            </div>
        </Card>
    </Fragment>
  )
}
