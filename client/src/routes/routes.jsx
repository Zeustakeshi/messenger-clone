import { createBrowserRouter, useNavigate } from "react-router-dom";
import AuthLayout from "../layout/AuthLayout";
import ChatLayout from "../layout/ChatLayout";
import HomeLayout from "../layout/HomeLayout";
import MainLayout from "../layout/MainLayout";
import Chat from "../pages/Chat";
import Friend from "../pages/Friend";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { useApp } from "../context/AppContext";
import { useEffect, useLayoutEffect } from "react";
import CallLayout from "../layout/CallLayout";
import IncomeCall from "../pages/IncomeCall2";
import Call from "../pages/Call";
import Test from "../components/Test";

const PrivateRoute = ({ children }) => {
    const { user } = useApp();

    const navigation = useNavigate();

    useEffect(() => {
        if (!user || !user.username) navigation("/auth/login");
    }, [user]);

    return <>{children}</>;
};

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <PrivateRoute>
                <MainLayout></MainLayout>
            </PrivateRoute>
        ),
        children: [
            {
                path: "",
                element: <HomeLayout></HomeLayout>,
                children: [
                    {
                        path: "friends",
                        element: <Friend></Friend>,
                    },
                    {
                        path: "home",
                        element: <Home></Home>,
                    },
                ],
            },
        ],
    },
    {
        path: "/auth",
        element: <AuthLayout></AuthLayout>,
        children: [
            {
                path: "login",
                element: <Login></Login>,
            },
            {
                path: "register",
                element: <Register></Register>,
            },
        ],
    },
    {
        path: "/chats",
        element: (
            <PrivateRoute>
                <ChatLayout></ChatLayout>
            </PrivateRoute>
        ),
        children: [
            {
                path: ":id",
                element: <Chat></Chat>,
            },
        ],
    },
    {
        path: "/call",
        element: (
            <PrivateRoute>
                <CallLayout></CallLayout>
            </PrivateRoute>
        ),
        children: [
            {
                path: ":id",
                element: <Call></Call>,
            },
            {
                path: "income/:id",
                element: <IncomeCall></IncomeCall>,
            },
        ],
    },
    {
        path: "test",
        element: <Test></Test>,
    },
]);

export default router;
