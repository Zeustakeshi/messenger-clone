import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { socket } from "../socket/socket";
import Cookies from "js-cookie";
import Header from "../components/Header";

const MainLayout = () => {
    const { user } = useApp();
    const navigation = useNavigate();

    useEffect(() => {
        if (window.location.pathname === "/") navigation("/home");
        console.log(window.location.pathname);
    }, []);

    useEffect(() => {
        if (!socket.connected) {
            socket.auth = {
                token: Cookies.get("access-token"),
            };
            socket.connect();
        }

        function onConnect() {
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        socket.on("friend-online", (message) => {
            console.log({ message });
        });

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("friend-online");
        };
    }, [socket]);

    useEffect(() => {
        if (!user?.username) {
            navigation("/auth/login");
        }
    }, [user]);

    return (
        <div className="w-full h-full hidden-scrollbar">
            <Header></Header>
            <div className="w-full h-hull p-5">
                <Outlet></Outlet>
            </div>
        </div>
    );
};

export default MainLayout;
