import React from "react";
import Avatar from "../Avatar";
import { NavLink, useNavigate } from "react-router-dom";
import { useChat } from "../../context/ChatContext";

const ChatHeader = () => {
    const { currentChat } = useChat();

    const navigation = useNavigate();

    const handleVoiceCall = () => {
        if (!currentChat) return;
        navigation(`/call/${currentChat?.id}?voice=true`, {
            state: currentChat,
        });
    };

    const handleVideoCall = () => {
        if (!currentChat) return;
        navigation(`/call/${currentChat?.id}?voice=true`, {
            state: currentChat,
        });
    };

    return (
        <div className="absolute top-0 left-0 h-[65px] bg-slate-50 bg-opacity-80 z-50 backdrop-blur px-5 py-3 w-full border-b border-b-slate-200 flex justify-between items-center gap-3">
            <div className="flex justify-start items-center gap-2">
                <NavLink
                    to="/home"
                    className="inline-block hover:text-blue-500 font-semibold text-lg p-2"
                >
                    <ion-icon name="chevron-back-outline"></ion-icon>
                </NavLink>
                <Avatar isOnline={currentChat?.status}></Avatar>
                <p className="text-lg font-semibold text-slate-600">
                    {currentChat?.name}
                </p>
            </div>
            <div className="flex justify-end items-center gap-2">
                <button
                    onClick={handleVoiceCall}
                    className="p-3 hover:bg-blue-500 hover:text-white font-semibold text-slate-600 flex justify-center items-center rounded-md "
                >
                    <ion-icon name="call-outline"></ion-icon>
                </button>
                <button
                    onClick={handleVideoCall}
                    className="p-3 hover:bg-blue-500 hover:text-white font-semibold text-slate-600 flex justify-center items-center rounded-md "
                >
                    <ion-icon name="videocam-outline"></ion-icon>
                </button>
            </div>
        </div>
    );
};

export default ChatHeader;
