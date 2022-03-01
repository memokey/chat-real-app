import React, { useState } from 'react'
import Button from '../../../../components/shared/Button/Button';
import Card from '../../../../components/shared/Card/Card'
import Textinput from '../../../../components/shared/Textinput/Textinput'
import style from '../EmailPhone.module.css';

export default function Email({onNext}) {
    const [email, setEmail] = useState('');

  return (
    <Card title="Enter your Email Address" icon="email-emoji">
    <Textinput value={email} onChange={(e) => setEmail(e.target.value)} type="email"  />
        <div>
            <div className={style.actionButtonWrap}>
                <Button label="Next" onClick={onNext} />
            </div>
            <p className={style.bottomParagraph}>
                By entering your Email, you’re agreeing to our Terms of
                Service and Privacy Policy. Thanks!
            </p>
        </div>
    </Card>
  )
}
