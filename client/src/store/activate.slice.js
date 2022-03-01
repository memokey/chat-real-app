import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  name: "",
  socket: null,
  peers: [],
  rooms: [],
  msgs: [],
}


export const activateSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    setName(state, action) {
      localStorage.setItem('name', action.payload);
      state.name = action.payload;
    },
    setSocket(state, action) {
      state.socket = action.payload;
    },
    addPeer(state, action) {
      state.peers.push(action.payload);
    },
    addRoom(state, action) {
      state.rooms.push(action.payload);
    },
    setRooms(state, action) {
      state.rooms = action.payload;
    },
    addMsg(state, action) {
      state.msgs.push(action.payload);
    },
    removePeer(state, action) {
      var peerindex = state.peers.findIndex(s => s.peerId == action.payload.peerId)
      state.peers.splice(peerindex, 1);
    },
    setMsg(state, action) {
      state.msgs = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { setName, setSocket, addPeer, addRoom, setRooms, addMsg, removePeer, setMsg } = activateSlice.actions

export default activateSlice.reducer