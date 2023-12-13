import React, { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { CHAT_STATUS } from "../utils/chat";
import { socket } from "../socket/socket";
import api from "../configs/api";

const ChatContext = React.createContext(null);

const ChatProvider = ({ children }) => {
    const [currentChat, setCurrentChat] = useState();
    const [reply, setReply] = useState();
    const { state } = useLocation();

    const { id: chatid } = useParams();

    const [status, setStatus] = useState(state?.status || CHAT_STATUS.OFFLINE);

    useEffect(() => {
        socket.on("friend-online", (message) => {
            if (message.username === state.username)
                setStatus(CHAT_STATUS.ONLINE);
        });

        socket.on("friend-offline", (message) => {
            if (message.username === state.username) {
                setStatus(CHAT_STATUS.OFFLINE);
            }
        });

        return () => {
            socket.off("friend-online");
            socket.off("friend-offline");
        };
    }, [state?.status, socket]);

    useEffect(() => {
        if (state) return;

        (async () => {
            try {
                const res = await api({
                    method: "GET",
                    url: `/user/info/${chatid}`,
                });
                const data = res.data;

                setCurrentChat({
                    id: data.username,
                    name: data.username,
                    avatar: data.avatar,
                });
                setStatus(data.status || CHAT_STATUS.OFFLINE);
            } catch (error) {
                console.log(error);
            }
        })();
    }, [state]);

    useEffect(() => {
        setCurrentChat({
            id: state?.username,
            name: state?.username,
            avatar: state?.avatar,
        });
    }, []);

    const values = {
        currentChat,
        setCurrentChat,
        status,
        reply,
        setReply,
    };
    return (
        <ChatContext.Provider value={values}>{children}</ChatContext.Provider>
    );
};

const useChat = () => {
    const context = useContext(ChatContext);
    if (typeof context === "undefined" || !context) {
        throw new Error("useChat must be used within ChatProvider");
    }
    return context;
};

export { ChatProvider, useChat };
