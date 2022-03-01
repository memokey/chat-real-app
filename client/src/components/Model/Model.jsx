import React, { Fragment } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { createRoomApi } from '../../helper/http';

import styles from './Model.module.css';
import ACTIONS from '../../config/actions';

export default function Model({ onClose }) {
    const navigate = useNavigate();

    const { name } = useSelector((state) => state.activate);

    const createRoom = async () => {
        try {
            window.socket.emit(ACTIONS.JOIN, {roomId: -1, user: {name}});
            // const { data } = await createRoomApi({ name });
            // navigate(`/room/${data.roomId}`);
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <Fragment>
            <div className={styles.modalMask}>
                <div className={styles.modalBody}>
                    <button onClick={onClose} className={styles.closeButton}>
                        <img src="/images/close.png" alt="close" srcSet='' />
                    </button>

                    <div className={styles.modalFooter}>
                        <h2>Start a room, open to everyone</h2>
                        <button
                            className={styles.footerButton}
                            onClick={createRoom}
                        >
                            <span >Let's go</span>
                        </button>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
