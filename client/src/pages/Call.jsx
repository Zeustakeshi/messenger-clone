import React, { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import {
    useLocation,
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router-dom";
import { socket } from "../socket/socket";
import loadingSVG from "../assets/loading.svg";

const Call = () => {
    const [openAudio, setOpenAudio] = useState(false);
    const [openCamera, setOpenCamera] = useState(false);
    const [videoStream, setVideoStream] = useState(null);
    const [audioStream, setAudioStream] = useState(null);
    const [calling, setCalling] = useState(true);

    const { user } = useApp();

    const [searchParams] = useSearchParams();

    const { state } = useLocation();
    const currentChat = state;

    const videoRef = useRef(null);
    const audioRef = useRef(null);

    const navigation = useNavigate();

    /** Check authentication */
    useEffect(() => {
        if (!user?.username) {
            navigation("/auth/login");
        }
    }, [user]);

    /** Get default user media option  */
    useEffect(() => {
        (async () => {
            const audioOption = searchParams.get("voice");
            const cameraOption = searchParams.get("video");
            if (audioOption === "true" || audioOption === "on") {
                await handleOpenAudio();
            }
            if (cameraOption === "true" || cameraOption === "on") {
                await handleOpenCamera();
            }
        })();
    }, []);

    const handleOpenCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });

            setVideoStream(stream);
            videoRef.current.srcObject = stream;
            setOpenCamera(true);
        } catch (error) {
            alert("error: " + error);
        }
    };

    const handleStopCamera = () => {
        try {
            // Lấy tất cả các track của stream video
            const videoTracks = videoStream.getVideoTracks();
            // Toggle trạng thái của từng track
            videoTracks.forEach((track) => {
                track.enabled = !track.enabled;
            });
            // Đóng stream để giải phóng tài nguyên
            videoStream.getTracks().forEach((track) => track.stop());
            setOpenCamera(false);
        } catch (error) {
            console.error("Error toggling camera:", error);
            alert("Failed to toggle camera.");
        }
    };

    const handleOpenAudio = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
        });
        setAudioStream(stream);
        audioRef.current.srcObject = stream;
        setOpenAudio(true);
    };

    const handleStopAudio = () => {
        try {
            // Lấy tất cả các track của stream audio
            const audioTracks = audioStream.getAudioTracks();

            // Toggle trạng thái của từng track
            audioTracks.forEach((track) => {
                track.enabled = !track.enabled;
            });

            // Đóng stream để giải phóng tài nguyên
            audioStream.getTracks().forEach((track) => track.stop());
            setOpenAudio(false);
        } catch (error) {
            console.error("Error toggling camera:", error);
            alert("Failed to toggle camera.");
        }
    };

    const handleToggleCamera = async () => {
        if (openCamera) {
            handleStopCamera();
        } else {
            await handleOpenCamera();
        }
    };

    const handleToggleMic = async () => {
        if (openAudio) {
            handleStopAudio();
        } else {
            handleOpenAudio();
        }
    };

    const endCall = () => {
        if (openCamera) handleStopCamera();
        if (openAudio) handleStopAudio();
        navigation(`/chats/${currentChat?.id}`);
    };

    return (
        <div className="relative h-screen w-screen">
            <div className="relative w-screen h-screen">
                <div className="shadow-xl absolute top-2 right-2 z-50 w-[150px] h-[230px] rounded-lg overflow-hidden">
                    {!openCamera && (
                        <img
                            className="w-full h-full object-fill"
                            src="https://images.unsplash.com/photo-1567808291548-fc3ee04dbcf0?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt=""
                        />
                    )}
                    <video
                        className="flip-camera w-full h-full"
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        hidden={!openCamera}
                    ></video>
                </div>

                {calling && (
                    <div className="flex justify-center items-center flex-col absolute-center shadow-md w-[50%] h-[160px] bg-white bg-opacity-60 backdrop-blur rounded-lg">
                        <div className="w-[80px] h-[80px]">
                            <img src={loadingSVG} alt="" />
                        </div>
                        <span className="text-sm text-slate-600 my-2">
                            Đang gọi .....
                        </span>
                    </div>
                )}
                <img
                    className="w-full h-full object-fill"
                    src="https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt=""
                />

                <video
                    className="flip-camera w-full h-full"
                    // ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    hidden={!openCamera}
                ></video>
                <audio ref={audioRef} autoPlay playsInline></audio>
            </div>
            <div className="flex justify-center items-center gap-5 absolute bottom-[10%] left-[50%] -translate-x-[50%] p-5 bg-slate-50 bg-opacity-70 backdrop-blur shadow-md rounded-lg">
                <button
                    onClick={handleToggleMic}
                    className={`p-4 flex justify-center items-center bg-slate-50 ${
                        openAudio ? "text-green-500" : "text-rose-600"
                    } shadow-xl rounded-lg`}
                >
                    {openAudio ? (
                        <ion-icon name="mic"></ion-icon>
                    ) : (
                        <ion-icon name="mic-off"></ion-icon>
                    )}
                </button>

                <button
                    onClick={handleToggleCamera}
                    className={`p-4 flex justify-center items-center bg-slate-50 ${
                        openCamera ? "text-green-500" : "text-rose-600"
                    } shadow-xl rounded-lg`}
                >
                    {openCamera ? (
                        <ion-icon name="videocam"></ion-icon>
                    ) : (
                        <ion-icon name="videocam-off"></ion-icon>
                    )}
                </button>
                <button
                    onClick={endCall}
                    className="p-4 flex justify-center items-center bg-rose-600 text-white shadow-xl rounded-lg"
                >
                    <ion-icon name="call"></ion-icon>
                </button>
            </div>
        </div>
    );
};

export default Call;
