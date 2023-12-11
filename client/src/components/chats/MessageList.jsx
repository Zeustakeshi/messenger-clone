import React from "react";
import MessageItem from "./MessageItem";

const types = ["friend", "user"];
const MessageList = () => {
    return (
        <div className="w-full px-5 py-[65px] flex-1 h-[90%] max-h-[90%] overflow-scroll hidden-scroll">
            {new Array(10).fill(0).map((_, index) => {
                return (
                    <MessageItem
                        parent={{
                            id: crypto.randomUUID(),
                            username: "minhhieu",
                            data: "hello world",
                        }}
                        username="minhhieu"
                        data="Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus, voluptatum?"
                        id={crypto.randomUUID()}
                        key={index}
                        type={types[Math.floor(Math.random() * 2)]}
                    ></MessageItem>
                );
            })}
        </div>
    );
};

export default MessageList;
