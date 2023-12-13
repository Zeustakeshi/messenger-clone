import React, { useEffect, useState } from "react";
import FriendItem from "./FriendItem";
import api from "../configs/api";
import coffeeLoadding from "../assets/coffee.loading.svg";
import { socket } from "../socket/socket";

const FriendList = () => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        (async () => {
            try {
                const res = await api({
                    method: "GET",
                    url: "/user/friends",
                });
                setFriends(res.data);
            } catch (error) {
                console.log(error);
            }
            setLoading(false);
        })();
    }, []);

    useEffect(() => {
        socket.on("accepted-friend", (data) => {
            setFriends((prev) => [...prev, data]);
        });

        return () => {
            socket.off("accepted-friend");
        };
    }, []);

    return (
        <div className="w-full h-full">
            <h2 className="text-slate-500 text-sm font-medium mb-5">Bạn bè</h2>
            <div className="w-full flex flex-col justify-start items-center gap-4">
                {friends.length ? (
                    friends.map((friend, index) => {
                        return (
                            <FriendItem key={index} {...friend}></FriendItem>
                        );
                    })
                ) : loading ? (
                    <div className="w-full h-full flex justify-center items-center">
                        <img
                            src={coffeeLoadding}
                            alt=""
                            className="w-[80px] h-[80px]"
                        />
                    </div>
                ) : (
                    <h4 className="text-xs text-slate-600">
                        Chưa có người bạn nào
                    </h4>
                )}
            </div>
        </div>
    );
};

export default FriendList;
