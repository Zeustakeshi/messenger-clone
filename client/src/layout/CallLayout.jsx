import React from "react";
import { CallProvider } from "../context/CallContext";
import { Outlet } from "react-router-dom";

const CallLayout = () => {
    return (
        <CallProvider>
            <Outlet></Outlet>
        </CallProvider>
    );
};

export default CallLayout;
