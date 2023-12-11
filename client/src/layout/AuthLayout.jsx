import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
const AuthLayout = () => {
    const { user } = useApp();
    const navigation = useNavigate();

    useEffect(() => {
        console.log({ user });
        if (!user?.username) {
            navigation("/auth/login");
        } else {
            navigation("/");
        }
    }, [user]);
    return (
        <div className=" p-5 w-screen h-screen">
            <Outlet></Outlet>
        </div>
    );
};

export default AuthLayout;
