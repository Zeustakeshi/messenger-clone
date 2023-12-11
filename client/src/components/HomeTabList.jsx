import React from "react";
import HomeTabItem from "./HomeTabItem";

const HomeTabList = () => {
    return (
        <div className="flex justify-center items-center">
            <HomeTabItem to="/home">Trò chuyện</HomeTabItem>
            <HomeTabItem to="/friends">Bạn bè</HomeTabItem>
        </div>
    );
};

export default HomeTabList;
