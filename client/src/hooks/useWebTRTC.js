import { useCallback, useEffect, useRef } from 'react';
import socketInit from '../socket';
import { useStateWithCalllback } from './useStateWithCalllback';
import ACTIONS from '../config/actions';
import freeice from 'freeice';

export const useWebTRTC = (roomId, user) => {
    const [clients, setclients] = useStateWithCalllback([]);
    const audioElements = useRef({});
    const socket = useRef(null);
    const clientsRef = useRef([]);

    useEffect(() => {
        socket.current = socketInit();
    }, []);

    const connections = useRef({});
    const localMediaStream = useRef({});

    const provideRef = (instance, userId) => {
        audioElements.current[userId] = instance;
    }


    const addNewClient = useCallback((newClient, cb) => {

        const lookingFor = clients.find((cl) => cl.id === newClient.id);
        if (lookingFor === undefined) {
            setclients((prevClients) => [...prevClients, newClient], cb);
        }

        // eslint-disable-next-line
    }, [clients, setclients])

    // capture media
    useEffect(() => {
        const startCapture = async () => {
            localMediaStream.current = await navigator.mediaDevices.getUserMedia({
                audio: true
            });
        }

        startCapture().then(() => {
            addNewClient({ ...user, muted: true }, () => {
                const localAudioElement = audioElements.current[user.id];
                if (localAudioElement) {
                    localAudioElement.volume = 0;
                    localAudioElement.srcObject = localMediaStream.current;
                }

                // join to soocket
                socket.current.emit(ACTIONS.JOIN, { roomId, user });
            });
        });

        return () => {
            // leaving room
            localMediaStream.current.getTracks().forEach((track) => track.stop())
            socket.current.emit(ACTIONS.LEAVE, { roomId })
        }

        // eslint-disable-next-line
    }, [])




    useEffect(() => {
        const handelNewPeer = async ({ peerId, createOffer, user: remoteUser }) => {
            // is allready connected then give warning

            if (peerId in connections.current) {
                // console.log('u are ALLLREADY CONNECTED', peerId);
                return;
            }

            connections.current[peerId] = new RTCPeerConnection({
                iceServers: freeice()
            });

            // handel new ice candidate
            connections.current[peerId].onicecandidate = (event) => {
                socket.current.emit(ACTIONS.RELAY_ICE, {
                    peerId,
                    iceCandidate: event.candidate
                });
            }

            // handel track on  connection
            connections.current[peerId].ontrack = ({ streams: [remoteStream] }) => {
                addNewClient({ ...remoteUser, muted: true }, () => {
                    if (audioElements.current[remoteUser.id]) {
                        audioElements.current[remoteUser.id].srcObject = remoteStream;
                    } else {
                        let settled = false;

                        const interVal = setInterval(() => {
                            if (audioElements.current(remoteUser.id)) {
                                audioElements.current[remoteUser.id].srcObject = remoteStream;
                                settled = true;
                            }

                            if (settled) {
                                clearInterval(interVal)
                            }
                        }, 1000)

                    };
                });
            };
            // add local track to remmoote connections
            localMediaStream.current.getTracks().forEach(track => {
                connections.current[peerId].addTrack(track, localMediaStream.current);
            });

            // check is need to create offers
            if (createOffer) {

                // createoffer
                const offer = await connections.current[peerId].createOffer();

                await connections.current[peerId].setLocalDescription(offer);
                // send offer to another cllient
                socket.current.emit(ACTIONS.RELAY_SDP, {
                    peerId,
                    sessionDescription: offer
                });
            }
        };

        socket.current.on(ACTIONS.ADD_PEER, handelNewPeer);

        return () => {
            socket.current.off(ACTIONS.ADD_PEER);
        }

    }, []);

    // Handle ice candidate
    useEffect(() => {
        socket.current.on(ACTIONS.ICE_CANDIDATE, ({ peerId, iceCandidate }) => {
            // console.log('ices', connections.current[peerId]);
            if (iceCandidate) {
                connections.current[peerId].addIceCandidate(iceCandidate);
            }
        });

        return () => {
            socket.current.off(ACTIONS.ICE_CANDIDATE);
        };
    }, []);

    // Handle session description

    useEffect(() => {
        const setRemoteMedia = async ({
            peerId,
            sessionDescription: remoteSessionDescription,
        }) => {
            connections.current[peerId].setRemoteDescription(
                new RTCSessionDescription(remoteSessionDescription)
            );

            // If session descrition is offer then create an answer
            if (remoteSessionDescription.type === 'offer') {
                const connection = connections.current[peerId];

                const answer = await connection.createAnswer();
                connection.setLocalDescription(answer);

                socket.current.emit(ACTIONS.RELAY_SDP, {
                    peerId,
                    sessionDescription: answer,
                });
            }
        };

        socket.current.on(ACTIONS.SESSION_DESCRIPTION, setRemoteMedia);
        return () => {
            socket.current.off(ACTIONS.SESSION_DESCRIPTION);
        };
    }, []);

    // handell remover peer

    useEffect(() => {
        const handleRemovePeer = ({ peerId, userId }) => {

            if (connections.current[peerId]) {
                connections.current[peerId].close();
            }

            delete connections.current[peerId];
            delete audioElements.current[peerId];
            setclients((list) => list.filter((c) => c.id !== userId));
        };

        socket.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer);

        return () => {
            socket.current.off(ACTIONS.REMOVE_PEER);
        };

        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        clientsRef.current = clients;
    }, [clients])


    // listen  or mute and unmute
    useEffect(() => {
        socket.current.on(ACTIONS.MUTE, ({ peerId, userId }) => {
            setMicToggle(true, userId);
        })

        socket.current.on(ACTIONS.MUTE, ({ peerId, userId }) => {
            setMicToggle(false, userId);
        })

        const setMicToggle = (mute, userId) => {
            const clientIdx = clientsRef.current.map((client) => client.id).indexOf(userId);

            const allConnectedClients = JSON.parse(JSON.stringify(clientsRef.current));

            if (clientIdx > -1) {
                allConnectedClients[clientIdx].muted = mute;
                setclients(allConnectedClients);
            }
        }

    }, [])


    useEffect(() => {
        window.addEventListener('unload', function () {
            socket.current.emit(ACTIONS.LEAVE, { roomId });
        });
    }, []);

    const handelMute = (isMute, userId) => {
        // console.log("handel mure", isMute);
        // console.log("handel mure", userId);
        // let settled = false;
        // let interVel = setInterval(() => {
        //     if (localMediaStream.current) {
        //         console.log(localMediaStream.current);
        //         localMediaStream.current.getTracks()[0].enabled = !isMute;
        //         if (isMute) {
        //             socket.current.emit(ACTIONS.MUTE, { roomId, userId });
        //         } else {
        //             socket.current.emit(ACTIONS.UNMUTE, { roomId, userId });
        //         }
        //         settled = true;
        //     }

        //     if (settled) {
        //         clearInterval(interVel);
        //     }
        // }, 200)
    }

    return { clients, provideRef, handelMute };
}