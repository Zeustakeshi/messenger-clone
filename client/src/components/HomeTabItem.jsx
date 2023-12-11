import React from "react";
import { NavLink } from "react-router-dom";

const HomeTabItem = ({ children, to }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex-1 w-full text-center text-base font-medium px-4 py-2  border-b transition-all ${
                    isActive
                        ? " border-b-blue-500 text-blue-500 font-semibold"
                        : "border-b-slate-200"
                }`
            }
        >
            {children}
        </NavLink>
    );
};

export default HomeTabItem;
