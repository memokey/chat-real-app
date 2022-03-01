import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import {toast} from 'react-toastify';

import Card from "../../components/shared/Card/Card";
import Button from '../../components/shared/Button/Button';
import TextInput from '../../components/shared/Textinput/Textinput';

import { setName } from '../../store/activate.slice';

import style from "./home.module.css";

export default function Home() {
  const { name } = useSelector((state) => state.activate);
  const [fullname, setFullname] = useState(name);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function nextStep() {
    if (!fullname) {
      toast.error("Name required");
        return;
    }
    dispatch(setName(fullname));
    navigate("/rooms");
  }

  return (
    <Fragment>
      <div className={style.cardWrappper}>
        <Card title="Welcome to chatting system">
          <p className={style.para}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi
            maxime voluptates architecto deserunt aut? Voluptatum iure
            distinctio neque voluptates vel?
          </p>
          <br/>
          <div>
            <TextInput
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="Full Name"
            />
          </div>

          <div className={style.signinnWrapper}>
            <Button onClick={nextStep} label="Let's Go" />
          </div>
        </Card>
      </div>
    </Fragment>
  );
}
