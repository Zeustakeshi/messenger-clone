import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useApp } from "../context/AppContext";

const MainLayout = () => {
    const { user } = useApp();
    const navigation = useNavigate();

    useEffect(() => {
        if (window.location.pathname === "/") navigation("/home");
    }, []);

    return (
        <div className="w-full h-full hidden-scrollbar">
            <Header></Header>
            <div className="w-full h-hull p-5">
                <Outlet></Outlet>
            </div>
        </div>
    );
};

export default MainLayout;
