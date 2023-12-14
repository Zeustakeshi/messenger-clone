import React, { useEffect, useRef, useState } from "react";
import MessageList from "../components/chats/MessageList";
import MessageInput from "../components/chats/MessageInput";

const Chat = () => {
    const [addressBarHeight, setAddressBarHeight] = useState(0);

    useEffect(() => {
        const updateAddressBarHeight = () => {
            const newAddressBarHeight = window.outerHeight - window.innerHeight;
            setAddressBarHeight(newAddressBarHeight);
        };

        updateAddressBarHeight();
        window.addEventListener("resize", updateAddressBarHeight);

        return () => {
            window.removeEventListener("resize", updateAddressBarHeight);
        };
    }, []);

    return (
        <div
            style={{ height: `calc(100vh - ${addressBarHeight}px)` }}
            className="w-full h-screen flex flex-col justify-between items-center"
        >
            <MessageList></MessageList>
            <MessageInput></MessageInput>
        </div>
    );
};

export default Chat;
