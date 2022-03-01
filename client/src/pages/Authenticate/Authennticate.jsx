import React, { Fragment, useState } from 'react'
import StepOtp from '../Steps/StepOtp/StepOtp';
import StepPhoneEmail from '../Steps/StepPhoneEmail/StepPhoneEmail';

const steps = {
    1:StepPhoneEmail,
    2:StepOtp
}


export default function Authenticate() {
    const [step,setStep] = useState(1);
    const CurrentStep = steps[step];
    
    const onNext = () =>{
      setStep(step+1)
    }

  return (
    <Fragment>
        <CurrentStep onNext={onNext} />
    </Fragment> 
  )
}
