import React, { Fragment, useState } from 'react'
import StepAvtar from '../Steps/StepAvtar/StepAvtar';
import StepName from '../Steps/StepName/StepName';
import './activate.module.css';

const steps = {
  1: StepName,
  2: StepAvtar,
};



export default function Activate() {
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
