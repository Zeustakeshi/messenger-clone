import React, { useContext, useState } from "react";

import Cookies from "js-cookie";

const AppContext = React.createContext(null);
const AppProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const userStorage = localStorage.getItem("user");
        const token = Cookies.get("access-token");
        if (!userStorage || !token) return null;
        return JSON.parse(userStorage);
    });

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
