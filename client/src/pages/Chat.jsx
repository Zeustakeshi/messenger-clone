import React from "react";
import MessageList from "../components/chats/MessageList";
import MessageInput from "../components/chats/MessageInput";

const Chat = () => {
    return (
        <div className="w-full h-screen flex flex-col justify-between items-center">
            <MessageList></MessageList>
            <MessageInput></MessageInput>
        </div>
    );
};

export default Chat;
