import React, { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Card from "../../../components/shared/Card/Card";
import Button from "../../../components/shared/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Stepavtar.module.css";
import { setAvtar } from "../../../store/activate.slice";
import { activateUser } from "../../../helper/http";
import { setAuth } from "../../../store/auth.slice";
import Loader from '../../../components/shared/Loader/Loader';

export default function StepAvtar() {
  const { name, avtar } = useSelector((state) => state.activate);
  const [unMounnted, setunMounnted] = useState(false);
  const [loading, setloading] = useState(false);

  const dispatch = useDispatch();
  const [image, setImage] = useState("/images/monkey-avatar.png");

  const captureImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = function () {
      setImage(reader.result);
      dispatch(setAvtar(reader.result));
    };
  };

  const submit = async () => {
    if (!name || !avtar) {
      toast.error("Name and avatar are required1")
      return;
    }

    setloading(true);
    try {
      const { data } = await activateUser({ name, avatar: avtar });
      if (data.auth) {
        if(!unMounnted){
          dispatch(setAuth(data));
        }
      }
    } catch (error) {
      // logging 
    }
    finally {
      setloading(false);
    }
  };

  useEffect(() => {
    return () => {
      setunMounnted(true);
    }
  }, [])
  

  return (
    <Fragment>
      {
        loading ? (
          <Loader message="Activation in progress..." />
        ) : (
          <>
            <div className="cardWrapper">
              <Card title={`Okay, ${name}`} icon="monkey-emoji">
                <p className={styles.subHeading}>How’s this photo?</p>
                <div className={styles.avatarWrapper}>
                  <img className={styles.avatarImage} src={image} alt="avatar" srcSet='' />
                </div>
                <div>
                  <input
                    onChange={captureImage}
                    id="avatarInput"
                    type="file"
                    className={styles.avatarInput}
                  />
                  <label className={styles.avatarLabel} htmlFor="avatarInput">
                    Choose a different photo
                  </label>
                </div>
                <div>
                  <Button onClick={submit} label="Submit" />
                </div>
              </Card>
            </div>
          </>
        )
      }
    </Fragment>
  );
}
