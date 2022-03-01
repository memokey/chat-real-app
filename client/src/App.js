import { Routes, Route, Navigate } from "react-router-dom";
import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Home from "./pages/Home/Home";
import Navigation from './components/shared/Navigation/Navigation';
import Rooms from './pages/Rooms/Rooms';
import { ToastContainer } from 'react-toastify';
import { useLoadingWithRefresh } from './hooks/useLoadingWithRefresh';
import Loader from './components/shared/Loader/Loader';
import Room from './pages/Roommain/Room';
import socketInit from './socket';
import ACTIONS from './config/actions';

import 'react-toastify/dist/ReactToastify.css';
import "./App.css";

import { setName, addPeer, setRooms, addMsg, removePeer, setMsg } from './store/activate.slice';

function App() {
  const { loading } = useLoadingWithRefresh();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {

    // When a user click f5 key, it helps to forget a user's name.
    if(localStorage.getItem('name')) {
      dispatch(setName(localStorage.getItem('name')));
    }

    // This part is main for socket.
    window.socket = socketInit();
    window.socket.on(ACTIONS.ADD_PEER, data => {
      dispatch(addPeer(data));
    })
    window.socket.on(ACTIONS.REMOVE_PEER, data => {
      dispatch(removePeer(data));
    })

    window.socket.on(ACTIONS.SEND_MSG, data => {console.log(data);
      dispatch(addMsg(data));
    })

    window.socket.on(ACTIONS.ROOM_LIST, data => {
      dispatch(setRooms(data.rooms));
    })

    window.socket.on(ACTIONS.CREATE_ROOM, data => {
      dispatch(setMsg(data.msgs));
      navigate(`/room/${data.roomId}`);
    })
  }, []);
  
  return (
    <Fragment>
      {
        loading ? (
          <Loader message="Loading Please wait..." />
        ) : (
          <>
            <ToastContainer />
            <Navigation />
            <Routes>
              <Route path="/" element={<GuestRoute> <Home /> </GuestRoute>} />

              <Route path="/rooms" element={<GuestRoute> <Rooms /> </GuestRoute>} />

              <Route path="/room/:id" element={<GuestRoute> <Room /> </GuestRoute>} />

              <Route path="*" element={<GuestRoute> <Home /> </GuestRoute>} />
            </Routes>
          </>
        )
      }
    </Fragment>
  );
}



const GuestRoute = ({ children }) => {
  const { isAuth } = useSelector(state => state.auth);
  return isAuth ? <Navigate to="/rooms" /> : children;
};

// const SemiProtected = ({ children }) => {
//   const { isAuth, user } = useSelector(state => state.auth);

//   if (!isAuth) {
//     return <Navigate to="/" />
//   }

//   if (isAuth && !user.activated) {
//     return children
//   } else {
//     return <Navigate to="/rooms" />
//   }
// };

// const ProtectedRoute = ({ children }) => {
//   const { isAuth, user } = useSelector(state => state.auth);

//   if (!isAuth) {
//     return <Navigate to="/" />
//   } else {
//     return children;
//   }
// };


export default App;
