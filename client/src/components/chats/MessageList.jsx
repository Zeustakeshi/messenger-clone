import React, { useEffect, useRef, useState } from "react";
import MessageItem from "./MessageItem";
import { useChat } from "../../context/ChatContext";
import api from "../../configs/api";
import { useApp } from "../../context/AppContext";
import coffeeLoadding from "../../assets/coffee.loading.svg";
import { socket } from "../../socket/socket";
import InfiniteScroll from "react-infinite-scroll-component";

const MessageList = () => {
    const { currentChat } = useChat();
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const { user } = useApp();
    const [page, setPage] = useState({
        currentPage: 0,
        totalPage: 1,
        messageCount: 0,
    });

    const scrollRef = useRef();

    useEffect(() => {
        socket.on("receive-message", (data) => {
            setMessages((prev) => [data, ...prev]);
        });

        return () => {
            socket.off("receive-message");
        };
    }, []);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const res = await api({
                method: "GET",
                url: `/chat/messages/${currentChat.id}`,
                params: {
                    page: page.currentPage + 1,
                    limit: 8,
                },
            });
            const { messages, currentPage, totalPage, messageCount } = res.data;
            setMessages((prev) => [...prev, ...messages]);
            setPage({
                currentPage: currentPage,
                totalPage,
                messageCount,
            });
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (!currentChat?.id) return;
        (async () => {
            await fetchMessages();
        })();
    }, [currentChat]);

    if (!currentChat) return <></>;
    return messages.length ? (
        <div
            id="container-loading"
            ref={scrollRef}
            className="w-full max-w-full  py-[65px] flex-1 h-[100%] max-h-[100%] overflow-scroll hidden-scroll flex flex-col-reverse"
        >
            <InfiniteScroll
                dataLength={messages.length}
                next={() => {
                    fetchMessages();
                }}
                style={{
                    display: "flex",
                    flexDirection: "column-reverse",
                }} //To put endMessage and loader to the top.
                inverse={true}
                hasMore={page.currentPage <= page.totalPage}
                loader={
                    <h4 className="p-2 text-sm text-blue-500 text-center w-full bg-white backdrop-blur bg-opacity-75">
                        Đang tải....
                    </h4>
                }
                scrollableTarget="container-loading"
            >
                {messages.map((message, index) => {
                    return (
                        <div key={index} className="w-full px-5">
                            <MessageItem {...message}></MessageItem>
                        </div>
                    );
                })}
            </InfiniteScroll>
        </div>
    ) : loading ? (
        <div className="w-full h-full flex justify-center items-center">
            <img src={coffeeLoadding} alt="" className="w-[120px] h-[120px]" />
        </div>
    ) : (
        <div>Chưa có tin nhắn</div>
    );
};

export default MessageList;
