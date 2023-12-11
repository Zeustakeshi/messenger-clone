import { StatusCodes } from "http-status-codes";
import authService from "../services/auth.service.js";

class AuthController {
    async register(req, res) {
        const { username, password } = req.body;
        if (!username || !password) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json("Missing uername or password");
        }
        try {
            const response = await authService.register(username, password);
            return res.status(StatusCodes.CREATED).json(response);
        } catch (error) {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json(error.message);
        }
    }
    async login(req, res) {
        const { username, password } = req.body;

        if (!username || !password) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json("Missing uername or password");
        }

        try {
            const response = await authService.login(username, password);
            return res.status(StatusCodes.OK).json(response);
        } catch (error) {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json(error.message);
        }
    }
}

export default new AuthController();
