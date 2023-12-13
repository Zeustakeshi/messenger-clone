import React from "react";
import Avatar from "../Avatar";
import { useChat } from "../../context/ChatContext";
import moment from "moment";

/**
 *
 * @param {"friend" | "user"} type
 * @param {{
 *      id: string,
 *      username: string,
 *      data: string
 * }} parent
 * @param {string} id
 * @param {string} username
 * @param {string} avatar
 * @returns
 */
const MessageItem = ({ parent, senderId, data, createdAt, ...message }) => {
    const { currentChat } = useChat();
    const { setReply } = useChat();
    const { status } = useChat();
    const handleReply = () => {
        // setReply({
        //     id,
        //     username,
        //     data,
        // });
    };

    return (
        <div
            className={`relative w-full flex items-start gap-1 my-4 ${
                parent ? "mt-16" : ""
            } ${
                senderId !== currentChat.name ? "justify-end " : "justify-start"
            }`}
        >
            {parent && (
                <div
                    className={`absolute ${
                        senderId === currentChat.name ? "left-0" : "right-0"
                    }  bottom-[calc(100%+5px)] max-w-[80%]`}
                >
                    <p className="whitespace-nowrap text-ellipsis overflow-hidden p-2 bg-slate-50 text-slate-400">
                        {parent.data}
                    </p>
                </div>
            )}
            {senderId === currentChat.name && (
                <Avatar
                    src={currentChat.avatar}
                    size={30}
                    status={status}
                ></Avatar>
            )}
            <div className={`max-w-[60%] flex  flex-col items-end`}>
                <div
                    className={`relative px-3 py-2 rounded-md  max-w-full ${
                        senderId === currentChat.name
                            ? "bg-slate-100 "
                            : "bg-blue-500 text-white"
                    }`}
                >
                    {senderId === currentChat.name && (
                        <span className="text-slate-600 text-sm font-medium">
                            {senderId}
                        </span>
                    )}
                    <p className="max-w-full">{data}</p>
                    <p className="text-xs text-end mt-2">
                        {moment(createdAt).format("H:m")}
                    </p>
                </div>
                {senderId === currentChat.name && (
                    <button
                        onClick={handleReply}
                        className={`mt-1 text-sm text-slate-600 hover:text-blue-500`}
                    >
                        phản hồi
                    </button>
                )}
            </div>
            {/* {type === "user" && <Avatar size={30}></Avatar>} */}
        </div>
    );
};

export default MessageItem;
