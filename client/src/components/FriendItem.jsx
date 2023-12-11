import React, { useEffect, useState } from "react";
import Avatar from "./Avatar";
import { socket } from "../socket/socket";

const FriendItem = ({ username, avatar, status }) => {
    const [online, setOnline] = useState(() => status === "ONLINE"); // 0 : offline, 1: online

    useEffect(() => {
        socket.on("friend-online", (message) => {
            if (message.username !== username) return;
            setOnline(true);
        });

        socket.on("friend-offline", (message) => {
            if (message.username !== username) return;
            setOnline(false);
        });

        return () => {
            socket.off("friend-online");
            socket.off("friend-offline");
        };
    }, []);

    return (
        <div className="flex justify-between items-center w-full">
            <div className="flex-1 flex justify-start items-start gap-2">
                <Avatar size={50} src={avatar}></Avatar>
                <div className="flex-1 flex flex-col justify-start items-start">
                    <span className="text-lg font-medium text-slate-700">
                        {username}
                    </span>
                    <span
                        className={`text-sm ${
                            online ? "text-green-500" : "text-slate-600"
                        } font-medium`}
                    >
                        {online ? "online" : "offline"}
                    </span>
                </div>
            </div>
            <button className="w-[50px] h-[50px] flex justify-center items-center hover:bg-slate-200 rounded-lg">
                <ion-icon name="chatbubble-ellipses-outline"></ion-icon>
            </button>
        </div>
    );
};

export default FriendItem;
