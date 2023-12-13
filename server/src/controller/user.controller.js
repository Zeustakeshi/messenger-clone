import { StatusCodes } from "http-status-codes";
import userService from "../services/user.service.js";

class UserController {
    async requestAddFriend(req, res) {
        try {
            const user = req.user;
            const { name: friendUsername } = req.params;

            await userService.requestAddFriend(user.username, friendUsername);

            return res
                .status(StatusCodes.OK)
                .json({ mess: "add friend success!" });
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
        }
    }

    async getFriends(req, res) {
        const user = req.user;
        try {
            const response = await userService.getFriends(user.username);
            return res.status(StatusCodes.OK).json(response);
        } catch (error) {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json(error.message);
        }
    }

    async getSuggestionUser(req, res) {
        const user = req.user;
        try {
            const response = await userService.getSuggestionUser(user.username);
            return res.status(StatusCodes.OK).json(response);
        } catch (error) {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json(error.message);
        }
    }

    async acceptedFriend(req, res) {
        const user = req.user;
        const { name: friendUsername } = req.params;
        try {
            await userService.acceptedFriend(user.username, friendUsername);
            return res.status(StatusCodes.OK).json("You have become friends");
        } catch (error) {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json(error.message);
        }
    }

    async rejectedFriend(req, res) {
        const user = req.user;
        const { name: friendUsername } = req.params;
        try {
            await userService.rejectedFriend(user.username, friendUsername);
            return res
                .status(StatusCodes.OK)
                .json("request friend has been deleted!");
        } catch (error) {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json(error.message);
        }
    }

    async getPendingFriends(req, res) {
        const user = req.user;
        try {
            const response = await userService.getPendingFriends(user.username);
            return res.status(StatusCodes.OK).json(response);
        } catch (error) {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json(error.message);
        }
    }

    async getUserStatus(req, res) {
        const { username } = req.params;

        try {
            const status = await userService.getUserStatus(username);
            return res.status(StatusCodes.OK).json(status);
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
        }
    }

    async getUserInfo(req, res) {
        const { name } = req.params;

        try {
            const data = await userService.getUserInfo(name);
            return res.status(StatusCodes.OK).json(data);
        } catch (error) {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json(error.message);
        }
    }
}

export default new UserController();
