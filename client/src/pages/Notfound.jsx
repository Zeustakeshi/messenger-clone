import React from "react";
import notfoundImg from "../assets/404-error.png";
import { useNavigate } from "react-router-dom";
import IonIcon from "@reacticons/ionicons";
const Notfound = () => {
    const navigation = useNavigate();

    return (
        <div className="w-screen h-screen flex justify-center items-center p-8 bg-gradient-to-r from-purple-500 to-pink-500">
            <div className="relative w-full h-[320px] p-10 bg-white shadow-2xl bg-opacity-50 backdrop-blur rounded-md">
                <img
                    src={notfoundImg}
                    alt=""
                    className="w-full h-full object-cover"
                />
                <button
                    onClick={() => navigation("/home")}
                    className="absolute top-[95%] left-[50%] -translate-x-[50%] bg-gradient-to-r from-sky-500 to-indigo-500 text-white px-5  py-4 rounded-md min-w-[120px]"
                >
                    <IonIcon name="arrow-back-outline"></IonIcon>
                </button>
            </div>
        </div>
    );
};

export default Notfound;
