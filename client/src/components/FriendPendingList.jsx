import React, { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/effect-creative";
import { Autoplay, EffectCreative } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import coffeeLoadding from "../assets/coffee.loading.svg";
import api from "../configs/api";
import FriendPendingItem from "./FriendPendingItem";
import { socket } from "../socket/socket";

const FriendPendingList = () => {
    const [pendingFriends, setPendingFriends] = useState([]);
    const [loading, setLoading] = useState(true);

    /** GET PENDING FRIEND USER */
    useEffect(() => {
        (async () => {
            try {
                const res = await api({
                    method: "GET",
                    url: `/user/friends/pending`,
                });
                setPendingFriends(res.data);
            } catch (error) {
                console.log(error);
            }
            setLoading(false);
        })();
    }, []);

    useEffect(() => {
        socket.on("request-add-friend", (data) => {
            setPendingFriends((prev) => [...prev, data]);
        });

        return () => {
            socket.off("request-add-friend");
        };
    }, []);

    if (pendingFriends.length == 0) return <></>;
    return (
        <div className="w-full h-full">
            <h2 className="text-slate-500 text-sm font-medium mb-5">
                Lời mời kết bạn
            </h2>

            {pendingFriends.length ? (
                <Swiper
                    autoplay={true}
                    grabCursor={true}
                    effect={"creative"}
                    creativeEffect={{
                        prev: {
                            shadow: true,
                            translate: [0, 0, -400],
                        },
                        next: {
                            translate: ["100%", 0, 0],
                        },
                    }}
                    modules={[EffectCreative, Autoplay]}
                >
                    {pendingFriends.map((user, index) => {
                        return (
                            <SwiperSlide key={index}>
                                <FriendPendingItem
                                    setPendingFriends={setPendingFriends}
                                    username={user.username}
                                    avatar={user.avatar}
                                ></FriendPendingItem>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
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
                    Không có lời mời kết bạn nào
                </h4>
            )}
        </div>
    );
};

export default FriendPendingList;
