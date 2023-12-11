import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { socket } from "../socket/socket";
import ChatHeader from "../components/chats/ChatHeader";
import { ChatProvider } from "../context/ChatContext";

const ChatLayout = () => {
    const { user } = useApp();
    const navigation = useNavigate();

    useEffect(() => {
        if (window.location.pathname === "/") navigation("/home");
    }, []);

    useEffect(() => {
        return () => {
            socket.off("connect", () => {});
            socket.off("disconnect", () => {});
        };
    }, [socket]);

    useEffect(() => {
        if (!user?.username) {
            navigation("/auth/login");
        }
    }, [user]);

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
