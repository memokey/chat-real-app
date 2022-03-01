import React, { Fragment } from 'react'
import style from './button.module.css';

export default function Button({label,onClick}) {
  return (
    <Fragment>
        <button onClick={onClick} className={style.button}>
            <span>{label}</span>
            <img src="/images/arrow-forward.png" srcSet=""  className={style.arrow} alt="arrow-forward.png" />
        </button>
    </Fragment>
  )
}
