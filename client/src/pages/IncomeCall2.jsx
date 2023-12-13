import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import loading2SVG from "../assets/loading2.svg";
import api from "../configs/api";
import { useApp } from "../context/AppContext";
import { socket } from "../socket/socket";

const IncomeCall = () => {
    const [userCall, setUserCall] = useState(null);
    const navigation = useNavigate();
    const { user } = useApp();

    const [searchParams] = useSearchParams();
    const { id: userCallId } = useParams();

    /** LISTEN CALL STATUS */
    useEffect(() => {
        socket.on("receivce-end-call", ({ reason }) => {
            alert(reason);
            navigation("/home");
        });

        return () => {
            socket.off("receivce-end-call");
        };
    }, []);

    useLayoutEffect(() => {
        (async () => {
            try {
                const res = await api({
                    method: "GET",
                    url: `/user/info/${userCallId}`,
                });
                setUserCall(res.data);
            } catch (error) {
                console.log(error);
                navigation("/");
            }
        })();
    }, []);

    /** Check authentication */
    useEffect(() => {
        if (!user?.username) {
            navigation("/auth/login");
        }
    }, [user]);

    const handleAcceptCall = () => {
        socket.emit("accept-call", userCall.username);
        navigation(`/call/${userCall.username}?voice=true&type=receive`);
    };

    const handleRejectCall = () => {
        socket.emit("end-call", {
            to: userCall.username,
            reason: `${user.username} đã từ chối cuộc gọi`,
        });
        navigation("/home");
    };
    if (!userCall) return <></>;
    return (
        <div className="w-screen h-screen relative flex flex-col justify-center items-center">
            <img
                src={userCall.avatar}
                alt=""
                className="w-full h-full object-fill"
            />

            <div className="flex flex-col justify-center items-center gap-5 absolute-center min-w-[60%] min-h-[200px] bg-white shadow-xl p-5 rounded-md bg-opacity-60 backdrop-blur">
                <div className="w-[100px] h-[100px]">
                    <img src={loading2SVG} alt="" />
                </div>
                <h3 className="w-full text-center text-base text-slate-600">
                    {userCall.username} đang gọi đến .....
                </h3>
            </div>

            <div className="absolute bottom-[5%] left-[50%] -translate-x-[50%] w-[90%]  p-8 flex justify-between items-center">
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
