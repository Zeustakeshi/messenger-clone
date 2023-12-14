import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useChat } from "../../context/ChatContext";
import { socket } from "../../socket/socket";
import Avatar from "../Avatar";
import IonIcon from "@reacticons/ionicons";

const ChatHeader = () => {
    const { status, currentChat } = useChat();
    const navigation = useNavigate();

    const handleVoiceCall = () => {
        if (!currentChat) return;

        navigation(`/call/${currentChat?.id}?voice=true&type=call`);

        socket.emit("call-to", currentChat.name);
    };

    const handleVideoCall = () => {
        if (!currentChat) return;
        navigation(`/call/${currentChat?.id}?voice=true&type=call`);
    };
    if (!currentChat) return <></>;

    return (
        <div className="absolute top-0 left-0 h-[65px] bg-slate-50 bg-opacity-80 z-50 backdrop-blur px-5 py-3 w-full border-b border-b-slate-200 flex justify-between items-center gap-3">
            <div className="flex justify-start items-center gap-2">
                <NavLink
                    to="/home"
                    className="inline-block hover:text-blue-500 font-semibold text-lg p-2"
                >
                    <IonIcon name="chevron-back-outline"></IonIcon>
                </NavLink>
                <Avatar username={currentChat.id} status={status}></Avatar>
                <p className="text-lg font-semibold text-slate-600">
                    {currentChat?.name}
                </p>
            </div>
            <div className="flex justify-end items-center gap-2">
                <button
                    onClick={handleVoiceCall}
                    className="p-3 hover:bg-blue-500 hover:text-white font-semibold text-slate-600 flex justify-center items-center rounded-md "
                >
                    <IonIcon name="call-outline"></IonIcon>
                </button>
                <button
                    onClick={handleVideoCall}
                    className="p-3 hover:bg-blue-500 hover:text-white font-semibold text-slate-600 flex justify-center items-center rounded-md "
                >
                    <IonIcon name="videocam-outline"></IonIcon>
                </button>
            </div>
        </div>
    );
};

export default ChatHeader;
