import Peer from "peerjs";
import React, { useContext, useEffect, useRef, useState } from "react";
import loadingCoffee from "../assets/coffee.loading.svg";
import { useNavigate, useParams } from "react-router-dom";
import api from "../configs/api";

const CallContext = React.createContext(null);

/**
 * - call states:
 *      + calling
 *      + end call
 *      + pedding
 * -
 *
 *
 *
 */

const CallProvider = ({ children }) => {
    const [userCall, setUserCall] = useState();
    const [peerId, setPeerId] = useState();
    const peer = useRef(null);

    const { id: userCallId } = useParams();
    const navigation = useNavigate();

    useEffect(() => {
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

    useEffect(() => {
        peer.current = new Peer();
        peer.current.on("open", (id) => setPeerId(id));
    }, []);
    const values = { peer: peer.current, peerId, userCall };
    if (!peerId || !peer || !userCall)
        return (
            <div className="w-screen h-screen flex justify-center items-center">
                <div className="w-[150px] h-[150px]">
                    <img src={loadingCoffee} alt="" />
                </div>
            </div>
        );
    return (
        <CallContext.Provider value={values}>{children}</CallContext.Provider>
    );
};

const useCall = () => {
    const context = useContext(CallContext);
    if (typeof context === "undefined" || !context) {
        throw new Error("useCall must be used within CallProvider");
    }
    return context;
};

export { CallProvider, useCall };
