import React from "react";
import { useApp } from "../context/AppContext";
import Search from "../components/Search";
import FriendList from "../components/FriendList";
import Avatar from "../components/Avatar";

import { Outlet } from "react-router-dom";
import HomeTabList from "../components/HomeTabList";

const HomeLayout = () => {
    return (
        <div className="w-full h-full">
            <div className="w-full">
                <Search></Search>
                <HomeTabList></HomeTabList>
                <div className="w-full h-full p-5">
                    <Outlet></Outlet>
                </div>
            </div>
        </div>
    );
};

export default HomeLayout;
