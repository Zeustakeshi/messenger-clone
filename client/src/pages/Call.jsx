import React, { useEffect, useRef, useState } from "react";
import { useCall } from "../context/CallContext";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { socket } from "../socket/socket";
import loadingSVG from "../assets/loading.svg";
import IonIcon from "@reacticons/ionicons";

const CALL_STATE = {
    CALLING: "CALLING",
    PENDING: "PENDING",
    ENDED: "ENDED",
};

const Call = () => {
    // STATE
    const [callState, setCallState] = useState(CALL_STATE.PENDING);
    const [audioStream, setAudioStream] = useState();

    // GLOBAL STATE
    const { peerId, peer, userCall } = useCall();
    const { user } = useApp();

    // NAVIGATE
    const [searchParams] = useSearchParams();
    const { id: friendId } = useParams();
    const navigation = useNavigate();

    // REF
    const friendAudioRef = useRef(null);

    /** Get default user media option  */
    useEffect(() => {
        const type = searchParams.get("type");
        if (type === "call") setCallState(CALL_STATE.PENDING);
        else if (type === "receive") {
            setCallState(CALL_STATE.CALLING);
        }

        (async () => {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            setAudioStream(stream);
        })();
    }, []);

    // LISTEN PEER
    useEffect(() => {
        peer.on("call", (call) => {
            call.answer(audioStream);

            call.on("stream", function (audioStream) {
                if (friendAudioRef.current) {
                    friendAudioRef.current.srcObject = audioStream;
                }
            });
        });

        socket.on("accept-call", ({ from }) => {
            setCallState(CALL_STATE.CALLING);
            socket.emit("send-peer-id", {
                to: from,
                peerId: peerId,
            });
        });

        socket.on("receivce-peer-id", async ({ peerId }) => {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            const call = peer.call(peerId, stream);
            call?.on("stream", function (audioStream) {
                console.log({ audioStream });
                if (friendAudioRef.current) {
                    friendAudioRef.current.srcObject = audioStream;
                }
            });
        });

        socket.on("receivce-end-call", ({ reason }) => {
            alert(reason);
            navigation("/home");
        });

        return () => {
            socket.off("receivce-end-call");
            socket.off("accept-call");
            socket.off("receivce-peer-id");
        };
    });

    const endCall = () => {
        socket.emit("end-call", {
            to: friendId,
            reason: `${user.username} đã kết thúc cuộc gọi`,
        });
        navigation("/");
    };

    return (
        <div className="w-screen h-screen bg-gradient-to-r from-sky-500 to-indigo-500 flex justify-center items-center flex-col">
            <audio ref={friendAudioRef} autoPlay playsInline></audio>
            <h1 className="my-8 text-3xl font-semibold text-white">
                {userCall.username}
            </h1>
            <div className="w-[60%] h-[400px] flex justify-center items-center bg-white bg-opacity-40 backdrop-blur rounded-lg shadow-md p-5">
                {callState === CALL_STATE.CALLING && (
                    <img
                        src={userCall.avatar}
                        alt=""
                        className="w-full h-full object-cover rounded-[inherit]"
                    />
                )}

                {callState === CALL_STATE.PENDING && (
                    <img
                        src={loadingSVG}
                        alt=""
                        className="w-[300px] h-[300px] object-cover rounded-[inherit]"
                    />
                )}
            </div>
            <button
                onClick={endCall}
                className="mt-10 px-8 min-w-[150px] py-4 rounded-md shadow-xl bg-rose-600 text-white text-2xl font-semibold"
            >
                <IonIcon name="call-outline"></IonIcon>
            </button>
        </div>
    );
};

export default Call;
