import tokenService from "../services/token.service.js";

const socketAuthMiddleware = (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) next(new Error("Unauthorized !"));
    try {
        const data = tokenService.verifyToken(token);
        socket.user = data;
        next();
    } catch (error) {
        next(error);
    }
};

export default socketAuthMiddleware;
