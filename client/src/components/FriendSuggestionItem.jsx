import React, { useState } from "react";
import Avatar from "./Avatar";
import api from "../configs/api";

const FriendSuggestionItem = ({ username, avatar }) => {
    const [sended, setSended] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleAddFriend = async () => {
        if (sended || loading) return;

        try {
            setLoading(true);
            const res = await api({
                url: `/user/add-friend/request/${username}`,
            });

            if (res.data) setSended(true);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    return (
        <div className="p-5 min-w-full min-h-[100px] rounded-md bg-white border border-slate-300 flex justify-start items-start gap-2">
            <Avatar size={100} src={avatar}></Avatar>
            <div className="flex-1">
                <p className="text-xl text-slate-900">{username}</p>
                <div className="flex justify-start my-5 items-center gap-2">
                    <button
                        disabled={sended}
                        onClick={handleAddFriend}
                        className={`px-2 py-2 text-sm rounded-md font-medium ${
                            sended
                                ? "bg-slate-200 text-slate-700"
                                : "bg-blue-500 text-white "
                        }`}
                    >
                        {loading ? (
                            <div className="w-[20px] h-[20px] rounded-full border-2 border-blue-500 border-l-transparent animate-spin"></div>
                        ) : sended ? (
                            "Đã gửi"
                        ) : (
                            "kết bạn"
                        )}
                    </button>
                    <button className="text-sm font-medium text-slate-600 border border-slate-600 rounded-md px-2 py-2">
                        Nhắn tin
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FriendSuggestionItem;
