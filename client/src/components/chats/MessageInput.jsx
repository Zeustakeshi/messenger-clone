import React, { useEffect, useState } from "react";
import { useChat } from "../../context/ChatContext";
import useDebounce from "../../hooks/useDebounce";

const MessageInput = () => {
    const { reply, setReply } = useChat();
    const [message, setMessage] = useState("");
    const debounceValue = useDebounce(message);

    useEffect(() => {
        if (!debounceValue?.trim()) return;
    }, [debounceValue]);

    const handleSendMessage = () => {};

    return (
        <div className="min-h-[10%] max-h-[10%] w-full h-full relative">
            <div className="z-40 top-0 left-0 -translate-y-[100%] absolute px-1 text-xs text-blue-500 text-left w-full bg-white backdrop-blur bg-opacity-75">
                Đang soạn tin nhắn ....
            </div>
            {reply && (
                <div className="absolute bottom-[calc(100%+10px)] whitespace-nowrap text-ellipsis overflow-hidden w-full bg-slate-100 text-slate-500 px-5 py-2 ">
                    {reply.data}
                    <button
                        onClick={() => setReply(null)}
                        className="absolute top-0 right-0 p-1 rounded-full bg-slate-300 flex justify-center items-center text-white"
                    >
                        <ion-icon name="close-outline"></ion-icon>
                    </button>
                </div>
            )}
            <form className="flex justify-start items-center w-full h-full relative  border-t border-t-slate-200 focus-within:border-t-blue-500 focus-within:border-t-2">
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={`Tin nhắn tới Minh Hiếu`}
                    className="resize-none flex-1 h-full min-h-[50px] max-h-[60px] px-5 py-2 w-full outline-none "
                ></textarea>

                <button
                    disabled={!debounceValue.trim()}
                    className={`p-4 flex justify-center items-center ${
                        debounceValue.trim()
                            ? "text-blue-500"
                            : " text-slate-300"
                    }`}
                >
                    <ion-icon name="send"></ion-icon>
                </button>
            </form>
        </div>
    );
};

export default MessageInput;
