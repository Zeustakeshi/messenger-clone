import monent from "moment";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import Avatar from "../Avatar";
import { socket } from "../../socket/socket";
import { CHAT_STATUS } from "../../utils/chat";

const ChatItem = ({ friend, latestMessage: message }) => {
    const [status, setStatus] = useState(friend?.status || CHAT_STATUS.OFFLINE);
    const [latestMessage, setLatestMessage] = useState(() => ({
        ...message,
        isNew: false,
    }));
    const { user } = useApp();

    const navigate = useNavigate();

    const handleNavigate = () => {
        if (!friend?.username) return;
        setLatestMessage((prev) => ({ ...prev, isNew: false }));
        navigate(`/chats/${friend?.username}`, {
            state: {
                ...friend,
            },
        });
    };

    useEffect(() => {
        if (!friend || !friend?.username) return;
        socket.on("friend-online", (message) => {
            if (message.username === friend.username)
                setStatus(CHAT_STATUS.ONLINE);
        });
        socket.on("friend-offline", (message) => {
            if (message.username === friend.username)
                setStatus(CHAT_STATUS.OFFLINE);
        });

        socket.on("receive-message", (data) => {
            if (data.senderId === friend.username)
                setLatestMessage({ ...data, isNew: true });
        });

        return () => {
            socket.off("friend-offline");
            socket.off("friend-online");
            socket.off("receive-message");
        };
    }, [friend, friend.username, socket]);

    if (!friend || !friend?.username) return <></>;

    return (
        <button
            onClick={handleNavigate}
            className="flex justify-between items-center w-full my-2"
        >
            <div className="flex-1 flex justify-start items-start gap-2">
                <Avatar
                    size={50}
                    src={friend.avatar}
                    username={friend.username}
                    status={status}
                ></Avatar>
                <div className="flex-1 flex flex-col justify-start items-start">
                    <div className="w-full flex justify-between items-center  ">
                        <span className="text-lg font-medium text-slate-700">
                            {friend?.username}
                        </span>
                        <span className="text-xs text-slate-500">
                            {monent(latestMessage.createdAt).format("HH:MM")}
                        </span>
                    </div>
                    {latestMessage && (
                        <span
                            className={`text-sm  ${
                                latestMessage.isNew
                                    ? "font-semibold text-black"
                                    : "text-slate-500"
                            } whitespace-nowrap max-w-[250px] overflow-hidden text-ellipsis`}
                        >
                            {latestMessage.senderId === user?.username &&
                                "Bạn: "}
                            {latestMessage?.data}
                        </span>
                    )}
                </div>
            </div>
        </button>
    );
};

export default ChatItem;
