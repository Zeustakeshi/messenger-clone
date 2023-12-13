import { StatusCodes, getStatusCode } from "http-status-codes";
import chatService from "../services/chat.service.js";
import { MESSAGE_RECEIVER_TYPE } from "../utils/chat.util.js";

class ChatController {
    async sendMessage(req, res) {
        const user = req.user;
        const { receiverId, receiverType, data } = req.body;
        if (!receiverId || !receiverType) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json("Can't send message with anonymous receiver");
        }

        if (
            receiverType !== MESSAGE_RECEIVER_TYPE.GROUP &&
            receiverType !== MESSAGE_RECEIVER_TYPE.USER
        ) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json("Invalid receiverType!");
        }

        if (typeof data !== "string" || !data.trim()) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json("Can't send message with empty content");
        }

        try {
            const newMessage = await chatService.sendMessage({
                senderId: user.username,
                receiverId,
                receiverType,
                data,
            });
            return res.status(StatusCodes.CREATED).json(newMessage);
        } catch (error) {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json(error.message);
        }
    }

    async getMessages(req, res) {
        const user = req.user;
        const { chatId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        try {
            const data = await chatService.getMessage({
                user1: user.username,
                user2: chatId,
                page,
                limit,
            });

            return res.status(StatusCodes.OK).json(data);
        } catch (error) {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json(error.message);
        }
    }

    async getLatestMessage(req, res) {
        const user = req.user;
        const { chatId } = req.params;

        try {
            const message = await chatService.getLatestMessage({
                user1: user.username,
                user2: chatId,
            });

            return res.status(StatusCodes.OK).json(message);
        } catch (error) {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json(error.message);
        }
    }

    async getAllChat(req, res) {
        const user = req.user;
        try {
            const data = await chatService.getAllChat(user.username);
            return res.status(StatusCodes.OK).json(data);
        } catch (error) {
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json(error.message);
        }
    }
}

export default new ChatController();
