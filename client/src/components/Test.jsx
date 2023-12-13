import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { socket } from "../socket/socket";
const Test = () => {
    const [myId, setMyId] = useState();
    const [remotePeerId, setRemotePeerId] = useState("");

    const myVideoRef = useRef(null);
    const remoteUserVideoRef = useRef(null);
    const peerInstance = useRef(null);

    useEffect(() => {
        const peer = new Peer();
        peer.on("open", (id) => setMyId(id));

        peer.on("call", (call) => {
            (async () => {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        audio: true,
                        video: true,
                    });
                    call.answer(stream);
                    // myVideoRef.current.srcObject
                    call.on("stream", function (remoteStream) {
                        remoteUserVideoRef.current.srcObject = remoteStream;
                    });
                } catch (error) {
                    console.log(error);
                }
            })();
        });

        peerInstance.current = peer;
    }, []);

    const handleCall = async () => {
        try {
            myVideoRef.current.srcObject = stream;
            const call = peerInstance.current.call(remotePeerId, stream);

            call.on("stream", (remoteStream) => {
                remoteUserVideoRef.current.srcObject = remoteStream;
            });
        } catch (error) {
            mediaStream;
            console.log(error);
        }
    };

    return (
        <div className="min-w-[200px] min-h-[200px]">
            <h1>My peer id: {myId}</h1>

            <button
                onClick={() => {
                    socket.emit("accept-call", { to: "minhhieu" });
                }}
            >
                EMIT accept-call
            </button>

            <input
                type="text"
                placeholder="peer id: "
                value={remotePeerId}
                onChange={(e) => setRemotePeerId(e.target.value)}
            />
            <button onClick={handleCall}>call</button>
            <video
                ref={myVideoRef}
                autoPlay
                playsInline
                className="w-full h-full flip-camera"
            ></video>

            <video
                ref={remoteUserVideoRef}
                autoPlay
                playsInline
                className="w-full h-full flip-camera"
            ></video>
        </div>
    );
};

export default Test;
