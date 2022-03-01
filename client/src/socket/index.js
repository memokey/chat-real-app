import { io } from "socket.io-client";

const socketInit = ()=>{
    const  options = {
        'force new connection':true,
        reconnectionAttempt:'Infinity',
        timeout:10000,
        transport:['websocket']
    }

    return io('http://3.126.118.40:4000',options);
}


export default socketInit;


