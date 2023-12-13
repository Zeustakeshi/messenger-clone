import React from "react";
import { Outlet } from "react-router-dom";
import ChatHeader from "../components/chats/ChatHeader";
import { ChatProvider } from "../context/ChatContext";

const ChatLayout = () => {
    return (
        <ChatProvider>
            <div className="w-full h-screen relative">
                <ChatHeader></ChatHeader>
                <Outlet></Outlet>
            </div>
        </ChatProvider>
    );
};

export default ChatLayout;
