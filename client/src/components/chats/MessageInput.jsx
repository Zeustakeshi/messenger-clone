import React, { useEffect, useRef, useState } from "react";
import { useChat } from "../../context/ChatContext";
import useDebounce from "../../hooks/useDebounce";
import api from "../../configs/api";
import { socket } from "../../socket/socket";
import { useApp } from "../../context/AppContext";
import { PROCESS_SEND_MESSAGE } from "../../utils/chat";

const MessageInput = () => {
    const { reply, setReply } = useChat();
    const [message, setMessage] = useState("");
    const debounceValue = useDebounce(message);
    const { currentChat } = useChat();
    const [typing, setTyping] = useState(false);
    const [processSendMessage, setProcessSendMessage] = useState(null);
    const { user } = useApp();

    const inputRef = useRef();

    useEffect(() => {
        socket.emit("stop-typing", {
            receiverId: currentChat?.name,
            senderId: user?.username,
        });
    }, [debounceValue]);

    const handleChangeMessage = (e) => {
        setMessage(e.target.value);
        socket.emit("typing", {
            receiverId: currentChat?.name,
            senderId: user?.username,
        });
    };

    useEffect(() => {
        socket.on("typing", () => {
            setTyping(true);
        });

        socket.on("stop-typing", () => {
            setTyping(false);
        });

        return () => {
            socket.off("typing");
            socket.off("stop-typing");
        };
    }, []);

    const handleSendMessage = async () => {
        if (!debounceValue.trim()) return;

        try {
            setProcessSendMessage(PROCESS_SEND_MESSAGE.PENDING);
            setMessage("");
            inputRef.current?.focus();
            const res = await api({
                method: "POST",
                url: "/chat/messages/send",
                data: {
                    receiverId: currentChat.id,
                    receiverType: "USER",
                    data: debounceValue,
                },
            });
            setProcessSendMessage(PROCESS_SEND_MESSAGE.SENDED);
            socket.emit("send-message", res.data);
        } catch (error) {
            console.log("send message error: " + error.message);
            setProcessSendMessage(PROCESS_SEND_MESSAGE.ERROR);
        }

        setTimeout(() => {
            setProcessSendMessage(null);
        }, 800);
    };

    return (
        <div className="min-h-[10%] max-h-[10%] w-full h-full relative">
            {processSendMessage && (
                <div className="z-40 top-0 left-0 -translate-y-[100%] absolute px-1 text-xs text-blue-500 text-left w-full bg-white backdrop-blur bg-opacity-75">
                    {processSendMessage === PROCESS_SEND_MESSAGE.PENDING &&
                        "Đang gửi"}
                    {processSendMessage === PROCESS_SEND_MESSAGE.SENDED &&
                        "Đã gửi"}
                    {processSendMessage === PROCESS_SEND_MESSAGE.ERROR && "Lỗi"}
                </div>
            )}

            {typing && (
                <div className="z-40 top-0 left-0 -translate-y-[100%] absolute px-1 text-xs text-blue-500 text-left w-full bg-white backdrop-blur bg-opacity-75">
                    {currentChat?.name} đang soạn tin nhắn ....
                </div>
            )}
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
            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    await handleSendMessage();
                }}
                className="flex justify-start items-center w-full h-full relative  border-t border-t-slate-200 focus-within:border-t-blue-500 focus-within:border-t-2"
            >
                <textarea
                    ref={inputRef}
                    value={message}
                    onChange={handleChangeMessage}
                    placeholder={`Tin nhắn tới ${currentChat?.name}`}
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
