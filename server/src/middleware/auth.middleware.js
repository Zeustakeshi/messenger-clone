import { StatusCodes } from "http-status-codes";
import tokenService from "../services/token.service.js";

const authMiddleware = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
        return res.status(StatusCodes.FORBIDDEN).json("No credentials sent!");
    }

    const token = authorizationHeader.split(" ")[1];

    if (!token)
        return res.status(StatusCodes.FORBIDDEN).json("No credentials sent!");
    try {
        const data = tokenService.verifyToken(token);
        req.user = data;
        next();
    } catch (error) {
        return res.status(StatusCodes.FORBIDDEN).json(error.message);
    }
};

export default authMiddleware;
