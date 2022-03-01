import React, { Fragment, useState } from 'react'
import Email from './Email/Email';
import Phone from './Phone/Phone';
import styles from './EmailPhone.module.css';

const phoneEmailMap = {
    phone: Phone,
    email: Email
}

export default function StepPhoneEmail({ onNext }) {
    const [type, setType] = useState('phone');

    const Component = phoneEmailMap[type];



    return (
        <Fragment>
            <div className={styles.cardWrapper}>
                <div>
                    <div className={styles.buttonWrap}>
                        <button
                            className={`${styles.tabButton} ${type === 'phone' ? styles.active : ''
                                }`}
                            onClick={() => setType('phone')}
                        >
                            <img src="/images/phone-white.png" alt="phone" srcSet='' />
                        </button>
                        <button
                            className={`${styles.tabButton} ${type === 'email' ? styles.active : ''
                                }`}
                            onClick={() => setType('email')}
                        >
                            <img src="/images/mail-white.png" alt="email" srcSet='' />
                        </button>
                    </div>
                    <Component onNext={onNext} />
                </div>
            </div>
        </Fragment>
    )
}
