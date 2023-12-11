import React from "react";
import ChatItem from "./ChatItem";

const ChatList = () => {
    return (
        <div className="flex-1 h-full flex flex-col justify-start items-center gap-2">
            {new Array(10).fill(0).map((_, index) => {
                return (
                    <ChatItem
                        chatId={crypto.randomUUID()}
                        key={index}
                    ></ChatItem>
                );
            })}
        </div>
    );
};

export default ChatList;
