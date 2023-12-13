import React, { useEffect, useState } from "react";
import ChatItem from "./ChatItem";
import api from "../../configs/api";
import coffeeLoadding from "../../assets/coffee.loading.svg";
const ChatList = () => {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // if (chats.length > 0) {
        //     setLoading(false);
        //     return;
        // }
        (async () => {
            try {
                const res = await api({
                    method: "GET",
                    url: "/chat/all",
                });
                setChats(res.data);
                // sessionStorage.setItem("chats", JSON.stringify(res.data));
            } catch (error) {
                console.log(error);
            }
            setLoading(false);
        })();
    }, []);

    return (
        <div className="flex-1 h-full flex flex-col justify-start items-center gap-2">
            {loading ? (
                <div className="w-[50%] h-[200px] flex justify-center items-center">
                    <img src={coffeeLoadding} alt="" />
                </div>
            ) : chats.length ? (
                chats.map((chat, index) => {
                    return <ChatItem {...chat} key={index}></ChatItem>;
                })
            ) : (
                <span className="w-full text-center text-slate-600">
                    Không có cuộc trò chuyện nào để hiện thị
                </span>
            )}
        </div>
    );
};

export default ChatList;
