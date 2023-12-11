import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CHAT_STATUS } from "../utils/chat";

const ChatContext = React.createContext(null);

const ChatProvider = ({ children }) => {
    const [currentChat, setCurrentChat] = useState();
    const [reply, setReply] = useState();

    const { id: chatId } = useParams();

    /** Get current chat
     *  {
     *      id, name, avatar, status
     * }
     */
    useEffect(() => {
        setCurrentChat({
            id: crypto.randomUUID(),
            name: "random -name",
            avatar: null,
            status: CHAT_STATUS.ONLINE,
        });
    }, []);

    const values = { currentChat, setCurrentChat, reply, setReply };
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
