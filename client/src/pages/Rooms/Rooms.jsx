import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import Model from '../../components/Model/Model';
import Roomcard from '../../components/Roomcard/Roomcard';

import styles from './rooms.module.css';

import { getRoomsApi } from '../../helper/http';
import { setRooms } from '../../store/activate.slice';

export default function Rooms() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { rooms } = useSelector((state) => state.activate);

  const openModel = () => {
    setOpen(true);
  }

  const onClose = () => {
    setOpen(false);
  }

  useEffect(() => {
    const fetchRooms = async ()=>{
      const {data} = await getRoomsApi();
      dispatch(setRooms(data));
    }

    fetchRooms();
  }, [])
  

  return (
    <Fragment>
      <div className="container">
        <div className={styles.rooomHeader}>
          <div className={styles.left}>
            <span className={styles.heading}>All Rooms</span>
          </div>
          <div className={styles.right}>
            <button onClick={openModel} className={styles.startButton}>
              <img src="/images/add-room-icon.png" alt="add logo" srcSet="" />
              <span>Create</span>
            </button>
          </div>
        </div>

        {/* lists */}

        <div className={styles.roomList}>
          {rooms && rooms.map((room) => (
            <Roomcard key={room.roomId} room={room} />
          ))}
        </div>
      </div>

      { 
          open && <Model  onClose={onClose} />
      }
    </Fragment>
  )
}
