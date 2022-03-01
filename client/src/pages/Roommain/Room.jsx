import React, { useState, useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

import TextInput from '../../components/shared/Textinput/Textinput';
import Button from '../../components/shared/Button/MsgButton';

import { getRoomApi } from '../../helper/http';
import { useWebTRTC } from '../../hooks/useWebTRTC';

import styles from './Room.module.css';
import ACTIONS from '../../config/actions';
import { setMsg } from '../../store/activate.slice';

export default function Room() {

  const { peers, msgs, name } = useSelector((state) => state.activate);
  const dispatch = useDispatch();

  const { id: roomId } = useParams();
  // const { clients, provideRef, handelMute } = useWebTRTC(roomId, user);
  const [sendData, setSendData] = useState('');


  // const [isMute, setMute] = useState(true);

  // useEffect(() => {
  //   // handelMute(isMute, user.id);

  //   // eslint-disable-next-line
  // }, [isMute])

  const navigate = useNavigate();

  useEffect(() => {
    window.socket.on('send-msg', (data) => {
      console.log(data);
    })
  }, [])
  const handelManualLeave = () => {
    window.socket.emit(ACTIONS.LEAVE, { roomId, user: {name: name} } );
    dispatch(setMsg([]));
    navigate('/rooms');
  }

  useEffect(() => {
    // const fetchRoom = async () => {
    //   const { data } = await getRoomApi(roomId);
    //   setRoom(data);
    // }
    // fetchRoom();
  }, [roomId]);

  // const handelMuteBtnClick = (clientId) => {
  //   if(clientId !== user.id){
  //     return;
  //   }
  //   setMute((prev) => !prev);
  // }

  const handleKeyDown = (e) => {
    if(e.key === 'Enter') {
      sendMsg();
    }
  }

  const sendMsg = () => {
    window.socket.emit('send-msg', {roomId, data: sendData});
    setSendData('');
  }


  return (
    <Fragment>
      <div>
        <div className="container">
          <button onClick={handelManualLeave} className={styles.goBack}>
            <img src="/images/arrow-left.png" alt="back" srcSet="" />
            <span>All rooms</span>
          </button>
        </div>

        {/* <h1>All connected clients</h1> */}
        <div className="container">
          <div className={styles.clientWrap}>
            <div className={styles.header}>
              <h2 className={styles.actionButton}>Room Chat</h2>
              <div className={styles.actions}>
                <button onClick={handelManualLeave} className={styles.actionBtn}>
                  <img src="/images/win.png" alt="min" srcSet="" />
                  <span>Leave</span>
                </button>
              </div>
            </div>

            <div className="container-influid" style={{display: 'inline-flex', width: '100%'}}>
              <div className={styles.col3}>
                <ul className={styles.userList}>
                  {
                    peers && peers.map((ele, ind) => {
                      return (
                        <li className={styles.userListLi} key={ind}>{ele && ele.user.name}</li>
                      )
                    })
                  }
                </ul>
              </div>
              <div className={styles.col9}>
                <div className={styles.msgContent}>
                  <div className={styles.msgDirect}>
                    {
                      msgs && msgs.map((ele, ind) => {
                        return(
                          <p key={ind}><span><b>{ele && ele.user}:</b> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>{ele && ele.msg}</p>
                        )
                      })
                    }
                  </div>
                  <div className={styles.msgInput}>
                    <TextInput
                      value={sendData}
                      onChange={(e) => setSendData(e.target.value)}
                      onKeyDown={handleKeyDown}
                      style={{width: "95%"}}
                      placeholder="Input a message please."
                    />&nbsp;&nbsp;
                    <Button label="" style={{marginLeft: "20px"}} onClick={sendMsg} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <div className={styles.clientsList}>
            {
              clients && clients.map((ele, ind) => {
                // console.log(ele);
                return (
                  <div key={ind} className={styles.client}>
                    <div className={styles.userHead}>
                      <audio
                        autoPlay
                        ref={(instance) => (provideRef(instance, ele.id))}
                      />
                      <img className={styles.userAvatar} src={ele.avatar} alt="avatar" srcSet="" />
                      <button onClick={() => handelMuteBtnClick(ele.id)} className={styles.micBtn}>
                        {
                          ele?.muted ? (
                            <img className={styles.micImg} src="/images/mic-mute.png" alt="mic" />
                          ) : (
                            <img className={styles.micImg} src="/images/mic.png" alt="mic off" />
                          )
                        }
                      </button>
                    </div>
                    <p>{ele.name}</p>
                  </div>
                )
              })
            }
          </div> */}
        </div>
      </div>
    </Fragment>
  )
}
