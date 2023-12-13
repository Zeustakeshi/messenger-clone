import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import axios from "axios";
import Cookies from "js-cookie";

const Login = () => {
    const { setUser } = useApp();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigation = useNavigate();

    const handleSubmit = async (e) => {
        if (!username.trim() || !password.trim()) {
            alert("Vui lòng điền đủ thông tin");
            return;
        }
        try {
            setLoading(true);
            const res = await axios({
                method: "POST",
                url: `${import.meta.env.VITE_SERVER_URL}/auth/login`,
                data: { username, password },
            });

            const data = res.data;
            setUser(data.user);

            localStorage.setItem("user", JSON.stringify(data.user));
            Cookies.set("access-token", data.token.data, {
                expires: new Date(data.token.exp),
            });

            navigation("/");
        } catch (error) {
            alert(error?.response?.data || error?.response || error);
        }
        setLoading(false);
    };

    return (
        <div className="w-full">
            <h1 className="text-3xl text-blue-500 font-semibold text-center my-7">
                Đăng nhập
            </h1>
            <div className="border-t border-t-slate-200 py-5 w-full flex justify-start items-start flex-col gap-8">
                <div className="w-full max-w-full flex flex-col justify-start items-start">
                    <label
                        htmlFor="username"
                        className="text-base text-blue-500 font-semibold mb-2"
                    >
                        Tên tài khoản
                    </label>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        type="text"
                        placeholder="Tên tài khoản"
                        id="username"
                        name="username"
                        className="text-lg placeholder:text-slate-300 px-5 py-3 rounded-md outline-blue-500 border-slate-200 border w-full"
                    />
                </div>

                <div className="w-full max-w-full flex flex-col justify-start items-start">
                    <label
                        htmlFor="password"
                        className="text-base text-blue-500 font-semibold mb-2"
                    >
                        Mật khẩu
                    </label>
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder="Mật khẩu"
                        id="password"
                        name="password"
                        className="text-lg placeholder:text-slate-300 px-5 py-3 rounded-md outline-blue-500 border-slate-200 border w-full"
                    />
                </div>
                <button
                    onClick={handleSubmit}
                    className="px-5 py-3 rounded-md bg-blue-500 text-white font-medium text-lg w-full flex justify-center items-center"
                >
                    {loading ? (
                        <span className="block w-[20px] h-[20px] border-[2px] border-white border-l-transparent rounded-full animate-spin"></span>
                    ) : (
                        "Đăng nhập"
                    )}
                </button>
                <p className="flex justify-center items-center gap-2 w-full">
                    <span>Chưa có tài khoản? </span>
                    <NavLink
                        to="/auth/register"
                        className="text-blue-500 font-medium"
                    >
                        đăng ký
                    </NavLink>
                </p>
            </div>
        </div>
    );
};

export default Login;
