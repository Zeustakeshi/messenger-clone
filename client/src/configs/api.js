import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
});

api.interceptors.request.use(
    (request) => {
        const token = Cookies.get("access-token");
        const userStorage = localStorage.getItem("user");
        const user = JSON.parse(userStorage);
        if (token && user?.username) {
            request.headers["Authorization"] = `Bearer ${token}`;
        } else {
            window.location.replace("/auth/login");
        }
        return request;
    },
    (error) => error
);

export default api;
