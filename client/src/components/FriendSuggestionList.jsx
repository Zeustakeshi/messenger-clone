import React, { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/effect-creative";
import { Autoplay, EffectCreative } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import api from "../configs/api";
import FriendSuggestionItem from "./FriendSuggestionItem";
import coffeeLoadding from "../assets/coffee.loading.svg";

const FriendSuggestionList = () => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    /** GET SUGGESTION USER */
    useEffect(() => {
        (async () => {
            try {
                const res = await api({
                    method: "GET",
                    url: `/user/suggestions`,
                });
                setSuggestions(res.data);
            } catch (error) {
                console.log(error);
            }
            setLoading(false);
        })();
    }, []);

    return (
        <div className="w-full h-full">
            <h2 className="text-slate-500 text-sm font-medium mb-5">Đề xuất</h2>

            {suggestions.length ? (
                <Swiper
                    onAutoplayTimeLeft={2}
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
                    className="mySwiper"
                >
                    {suggestions.map((user, index) => {
                        return (
                            <SwiperSlide>
                                <FriendSuggestionItem
                                    key={index}
                                    username={user.username}
                                    avatar={user.avatar}
                                ></FriendSuggestionItem>
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
                    không tìm thấy đề xuất nào
                </h4>
            )}
        </div>
    );
};

export default FriendSuggestionList;
