import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import router from "./routes/routes";
import { AppProvider } from "./context/AppContext";
import Test from "./components/Test";

ReactDOM.createRoot(document.getElementById("root")).render(
    // <React.StrictMode>
    <AppProvider>
        {/* <Test></Test> */}
        <RouterProvider router={router} />
    </AppProvider>
    // </React.StrictMode>
);
