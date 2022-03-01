import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import styles from "./navigation.module.css";
import { useDispatch, useSelector } from 'react-redux';
import { setAuth } from '../../../store/auth.slice';
import { logout } from '../../../helper/http';

export default function Navigation() {
  const dispatch = useDispatch();
  const {isAuth,user} = useSelector((state) => state.auth)

  const baseStyle = {
    color: "#fff",
    textDecoration: "none",
    fontWeight: 'bold',
    fontSize: '22px',
    display: 'flex',
    alignItems: 'center'
  }

  const logotext = {
    marginLeft: '10px'
  }

  async function logoutUser() {
    try {
      const { data } = await logout();
      dispatch(setAuth(data));
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Fragment>
      <nav className={`container ${styles.navbar}`}>
        <Link style={baseStyle} to="/">
          <span style={logotext}>Chatting system</span>
        </Link>

        {isAuth && (
          <div className={styles.navRight}>
            <h3>{user?.name}</h3>
            <Link to="/">
              <img
                className={styles.avatar}
                src={
                  user.avatar
                    ? user.avatar
                    : '/images/monkey-avatar.png'
                }
                width="40"
                height="40"
                alt="avatar"
                srcSet=''
              />
            </Link>
            <button
              className={styles.logoutButton}
              onClick={logoutUser}
            >
              <img src="/images/logout.png" alt="logout" srcSet='' />
            </button>
          </div>
        )}
      </nav>
    </Fragment>
  );
}
