import React from "react";
import Avatar from "./Avatar";
import { useApp } from "../context/AppContext";
import { socket } from "../socket/socket";
import Cookies from "js-cookie";

const Header = () => {
    const { user, setUser } = useApp();

    const handleLogout = () => {
        socket.disconnect();
        localStorage.removeItem("user");
        Cookies.remove("access-token");
        setUser(null);
    };

    return (
        <header className="top-0  z-50 h-[61px] sticky bg-white bg-opacity-50 backdrop-blur border-b border-slate-100 flex justify-between items-center gap-2 p-5 py-6">
            <div className="flex justify-start items-center gap-3">
                <h1 className="text-2xl font-semibold text-right">
                    {user?.username}
                </h1>
                {/* <Avatar src={user?.avatar}></Avatar> */}
            </div>
            <button
                onClick={handleLogout}
                className="bg-rose-300 bg-opacity-50 text-rose-500 w-[30px] h-[30px] flex justify-center items-center rounded-md"
            >
                <ion-icon name="log-out-outline"></ion-icon>
            </button>
        </header>
    );
};

export default Header;
