import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "../layout/AuthLayout";
import ChatLayout from "../layout/ChatLayout";
import HomeLayout from "../layout/HomeLayout";
import MainLayout from "../layout/MainLayout";
import Call from "../pages/Call";
import Chat from "../pages/Chat";
import Friend from "../pages/Friend";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import IncomeCall from "../pages/IncomeCall";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout></MainLayout>,
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
        element: <ChatLayout></ChatLayout>,
        children: [
            {
                path: ":id",
                element: <Chat></Chat>,
            },
        ],
    },
    {
        path: "/call/:id",
        element: <Call></Call>,
    },
    {
        path: "/call/income/:id",
        element: <IncomeCall></IncomeCall>,
    },
]);

export default router;
