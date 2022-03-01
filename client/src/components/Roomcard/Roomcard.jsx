import React, { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import styles from './Roomcard.module.css';

import ACTIONS from '../../config/actions';

export default function Roomcard({ room }) {
    const { name } = useSelector((state) => state.activate);
    const joinRoom = () => {
        window.socket.emit(ACTIONS.JOIN, {roomId: room.roomId, user: {name}});
    }
    return (
        <Fragment>
            <div onClick={joinRoom} className={styles.card}>
                <h3 style={styles.topic}>{room.topic}</h3>
                <div className={`${styles.speakers} ${room.speakers.length === 1 ? styles.singleSpeaker : ''
                    }`}
                >
                    <div className={styles.avatars}>
                        <img
                            src="images/monkey-avatar.png"
                            alt='avatar'
                            srcSet=''
                        />
                    </div>
                    <div className={styles.names}>
                        {room.speakers.map((speaker) => (
                            <div key={speaker} className={styles.namesWrapper}>
                                <span>{speaker}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.peopleCount}>
                    <span>{room && room.speakers.length}</span>
                    <img src="/images/user-icon.png" alt="user-icon" srcSet='' />
                </div>
            </div>
        </Fragment>
    )
}
