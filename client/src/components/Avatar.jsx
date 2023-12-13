import React from "react";
import { CHAT_STATUS } from "../utils/chat";

const Avatar = ({ src, size = 40, status = CHAT_STATUS.OFFLINE }) => {
    return (
        <div
            style={{
                width: size,
                height: size,
            }}
            className="w-[40px] h-[40px] relative rounded-xl"
        >
            <img
                src={src || "https://source.unsplash.com/random"}
                alt="img"
                className="w-full h-full object-cover rounded-[inherit]"
            />
            {status === CHAT_STATUS.ONLINE && (
                <>
                    <span class="inline-block min-w-[30%] min-h-[30%] absolute z-10 -bottom-[6%] -right-[8%] p-1 bg-green-500 rounded-full animate-ping "></span>
                    <span class="absolute inline-block z-10 w-[20%] h-[20%] -bottom-[6%] -right-[8%] p-1 bg-green-500 rounded-full"></span>
                </>
            )}
        </div>
    );
};

export default Avatar;
