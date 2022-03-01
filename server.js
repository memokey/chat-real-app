require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);

const DbConnect = require('./config/db');
const router = require('./routes');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const ACTIONS = require('./config/actions');

const roomService = require('./services/room-service');

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

DbConnect();

app.use(express.json({ limit: '8mb' }));
app.use(cookieParser());
app.use('/storage', express.static('storage'));

app.use(cors({
    origin: '*'
}));

app.use(router);
const PORT = process.env.PORT || 4000;


const socketUserMapping = {}
var roomIndex = 0;
io.on('connection', (socket) => {
    console.log('new connection', socket.id);
    socket.socket_id = socket.id;

    socket.on(ACTIONS.JOIN, async ({ roomId, user }) => {
        socketUserMapping[socket.id] = user;
        socket.username = user.name

        if(roomId == -1) {
            roomId = roomService.create(roomIndex, {name: user.name, sid: socket.id});
            roomIndex ++;
        } else {
            roomService.joinRoom(roomId, {name: user.name, sid: socket.id});
        }
        socket.roomId = roomId;

        const room = await roomService.getRoom(roomId);
        if(!!room) {
            socket.emit(ACTIONS.CREATE_ROOM, {roomId, msgs: room.msgs});
            io.sockets.emit(ACTIONS.ROOM_LIST, {rooms: roomService.getAllRooms()});

            clients= room.clients.filter(s => s != socket.id) || [];
            clients.forEach(clientId => {
                io.to(clientId).emit(ACTIONS.ADD_PEER, {
                    peerId: socket.id,
                    createOffer: false,
                    user
                });

                socket.emit(ACTIONS.ADD_PEER, {
                    peerId: clientId,
                    createOffer: true,
                    user: socketUserMapping[clientId]
                });
            });

            socket.join('room' + roomId);
        }
    });

    socket.on(ACTIONS.SEND_MSG, ({roomId, data}) => {
        io.to('room' + roomId).emit(ACTIONS.SEND_MSG, {user: socket.username, msg: data});
        roomService.addMsg(roomId, {user: socket.username, msg: data});
    })

    // handel relay ice
    socket.on(ACTIONS.RELAY_ICE, ({ peerId, iceCandidate }) => {
        io.to(peerId).emit(ACTIONS.ICE_CANDIDATE, {
            peerId: socket.id,
            iceCandidate
        })
    })

    socket.on(ACTIONS.RELAY_SDP, ({ peerId, sessionDescription }) => {
        io.to(peerId).emit(ACTIONS.SESSION_DESCRIPTION, {
            peerId: socket.id,
            sessionDescription
        })
    })

    // mute or unmute the user
    socket.on(ACTIONS.MUTE, ({ roomId, userId }) => {
        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
        clients.forEach((clientId) => {
            io.to(clientId).emit(ACTIONS.MUTE, {
                peerId: socket.id,
                userId
            })
        })
    })

    socket.on(ACTIONS.UNMUTE, ({ roomId, userId }) => {
        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
        clients.forEach((clientId) => {
            io.to(clientId).emit(ACTIONS.UNMUTE, {
                peerId: socket.id,
                userId
            })
        })
    })

    // leaving the room 
    const leaveRoomFunc = async ({roomId, user}) => {

        room = await roomService.getRoom(roomId);
        if(!!room) {
            var clients = room.clients.filter(s => s != socket.id);
    
            clients.forEach((clientId) => {
                io.to(clientId).emit(ACTIONS.REMOVE_PEER, {
                    peerId: socket.id,
                    userId: socketUserMapping[socket.id]?.id,
                    user
                })

                socket.emit(ACTIONS.REMOVE_PEER, {
                    peerId: clientId,
                    userId: socketUserMapping[clientId]?.id,
                    user
                });
            })
            socket.roomId = -1;
            roomService.leaveRoom(roomId, {name: user.name, sid: socket.id});
            io.sockets.emit(ACTIONS.ROOM_LIST, {rooms: roomService.getAllRooms()});
            delete socketUserMapping[socket.id];
        }
    };

    socket.on(ACTIONS.LEAVE, leaveRoomFunc)
    socket.on('disconnect', () => {
        leaveRoomFunc({roomId: socket.roomId, user: {name: socket.username}});
        console.log('disconnection ' + socket.socket_id);
    })
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));



