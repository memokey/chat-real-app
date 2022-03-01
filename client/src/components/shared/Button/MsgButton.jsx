import React, { Fragment } from 'react'
import style from './button.module.css';

export default function Button({label,onClick}) {
  return (
    <Fragment>
        <button onClick={onClick} className={style.msgbutton}>
            <span>{label}</span>
            <img src="/images/send.png" srcSet=""  className={style.send} alt="arrow-forward.png" />
        </button>
    </Fragment>
  )
}