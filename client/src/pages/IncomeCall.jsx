import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import loading2SVG from "../assets/loading2.svg";

const IncomeCall = () => {
    const navigation = useNavigate();
    const { user } = useApp();

    const { state } = useLocation();
    const currentChat = state;

    /** Check authentication */
    useEffect(() => {
        if (!user?.username) {
            navigation("/auth/login");
        }
    }, [user]);

    const handleAcceptCall = () => {
        navigation(`/call/${crypto.randomUUID()}?voice=true`);
    };

    const handleRejectCall = () => {
        navigation("/");
    };

    return (
        <div className="w-screen h-screen relative">
            <img
                src="https://source.unsplash.com/random"
                alt=""
                className="w-full h-full object-fill"
            />

            <div className="flex flex-col justify-center items-center gap-5 absolute-center min-w-[60%] min-h-[200px] bg-white shadow-xl p-5 rounded-md bg-opacity-60 backdrop-blur">
                <div className="w-[100px] h-[100px]">
                    <img src={loading2SVG} alt="" />
                </div>
                <h3 className="w-full text-center text-base text-slate-600">
                    Đang gọi đến .....
                </h3>
            </div>

            <div className="absolute bottom-[5%] left-0 w-full p-8 flex justify-between items-center">
                <div className="relative w-[70px] h-[70px] flex justify-center items-center rounded-full">
                    <button
                        onClick={handleAcceptCall}
                        className="text-lg font-semibold z-10 absolute-center w-full h-full  shadow-xl bg-green-600 text-white rounded-full"
                    >
                        <ion-icon name="call"></ion-icon>
                    </button>
                    <div className=" w-[100%] h-[100%] rounded-[inherit] bg-green-500 bg-opacity-60 backdrop-blur animate-ping"></div>
                </div>
                <div className="relative w-[70px] h-[70px] flex justify-center items-center rounded-full">
                    <button
                        onClick={handleRejectCall}
                        className="text-lg font-semibold z-10 absolute-center w-full h-full  shadow-xl bg-rose-600 text-white rounded-full"
                    >
                        <ion-icon name="close"></ion-icon>
                    </button>
                    <div className=" w-[100%] h-[100%] rounded-[inherit] bg-rose-500 bg-opacity-60 backdrop-blur animate-ping"></div>
                </div>
            </div>
        </div>
    );
};

export default IncomeCall;
