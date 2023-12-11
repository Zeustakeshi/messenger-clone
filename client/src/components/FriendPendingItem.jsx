import React, { useState } from "react";
import Avatar from "./Avatar";
import api from "../configs/api";

const FriendPendingItem = ({ username, avatar, setPendingFriends }) => {
    const [acceptLoading, setAcceptLoading] = useState(false);
    const [rejectLoading, setRejectLoading] = useState(false);
    const handleAddFriend = async () => {
        setAcceptLoading(true);
        try {
            await api({
                method: "GET",
                url: `/user/add-friend/accepted/${username}`,
            });
        } catch (error) {
            console.log(error);
        }
        setAcceptLoading(false);
        setPendingFriends((friends) =>
            friends.filter((friend) => friend.username != username)
        );
    };

    const handleReject = async () => {
        setRejectLoading(true);
        try {
            await api({
                method: "GET",
                url: `/user/add-friend/reject/${username}`,
            });
        } catch (error) {
            console.log(error);
        }
        setPendingFriends((friends) =>
            friends.filter((friend) => friend.username != username)
        );

        setRejectLoading(false);
    };

    return (
        <div className="p-5  min-w-full min-h-[100px] rounded-md bg-white border border-slate-300 flex justify-start items-start gap-2">
            <Avatar size={100} src={avatar}></Avatar>
            <div className="flex-1">
                <p className="text-xl text-slate-900">{username}</p>
                <div className="flex justify-start my-5 items-center gap-2">
                    <button
                        onClick={handleAddFriend}
                        className="text-sm font-medium bg-blue-500 text-white rounded-md px-2 py-2"
                    >
                        {acceptLoading ? (
                            <div className="w-[20px] h-[20px] rounded-full border-2 border-blue-500 border-l-transparent animate-spin"></div>
                        ) : (
                            "Kết bạn"
                        )}
                    </button>
                    <button
                        onClick={handleReject}
                        className="text-sm font-medium text-slate-600 border border-slate-600 rounded-md px-2 py-2"
                    >
                        {rejectLoading ? (
                            <div className="w-[20px] h-[20px] rounded-full border-2 border-blue-500 border-l-transparent animate-spin"></div>
                        ) : (
                            "Gỡ"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FriendPendingItem;
