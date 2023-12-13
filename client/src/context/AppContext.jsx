import React, { useContext, useEffect, useLayoutEffect, useState } from "react";

import Cookies from "js-cookie";
import { socket } from "../socket/socket";

const AppContext = React.createContext(null);
const AppProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const userStorage = localStorage.getItem("user");
        const token = Cookies.get("access-token");
        if (!userStorage || !token) return null;
        return JSON.parse(userStorage);
    });

    /** CONNECT SOCKET */
    useEffect(() => {
        if (!user) return;

        if (!socket.connected) {
            socket.auth = {
                token: Cookies.get("access-token"),
            };
            socket.connect();
        }

        function onConnect() {
            console.log(
                "%cConnect socket success!",
                "color:green;font-size: 20px;"
            );
        }

        function onDisconnect() {}

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
        };
    }, [user, socket]);

    /** RECEIVE CALL */
    useEffect(() => {
        socket.on("receive-call", (from) => {
            window.location.replace(
                `${window.location.origin}/call/income/${from}`
            );
        });
        return () => {
            socket.off("receive-call");
        };
    }, []);

    const values = { user, setUser };
    return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};

const useApp = () => {
    const context = useContext(AppContext);
    if (typeof context === "undefined" || !context) {
        throw new Error("useApp must be used within AppProvider");
    }
    return context;
};

export { AppProvider, useApp };
