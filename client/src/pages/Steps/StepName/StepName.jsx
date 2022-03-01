import React, { Fragment, useState } from 'react'
import Card from '../../../components/shared/Card/Card';
import TextInput from '../../../components/shared/Textinput/Textinput';
import Button from '../../../components/shared/Button/Button';
import { useDispatch, useSelector } from 'react-redux';
import styles from './StepName.module.css';
import {toast} from 'react-toastify';
import { setName } from '../../../store/activate.slice';

export default function StepName({onNext}) {
  const { name } = useSelector((state) => state.activate);
  const dispatch = useDispatch();
  const [fullname, setFullname] = useState(name);
  
  function nextStep() {
    if (!fullname) {
      toast.error("Name required");
        return;
    }
    dispatch(setName(fullname));
    onNext();
}

  return (
    <Fragment>
             <div className="cardWrapper">

      <Card title="What’s your full name?" icon="goggle-emoji">
                <TextInput
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                />
                <p className={styles.paragraph}>
                    People use real names at chatting :) !
                </p>
                <div>
                    <Button onClick={nextStep} label="Next" />
                </div>
            </Card>
          </div>
    </Fragment>
  )
}
