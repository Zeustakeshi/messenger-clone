import React from "react";

import FriendSuggestionList from "../components/FriendSuggestionList";
import FriendList from "../components/FriendList";
import FriendPendingList from "../components/FriendPendingList";

const Friend = () => {
    return (
        <div className="flex flex-col justify-start items-center gap-8">
            <FriendSuggestionList></FriendSuggestionList>
            <FriendPendingList></FriendPendingList>
            <FriendList></FriendList>
        </div>
    );
};

export default Friend;
