import { Op } from "sequelize";
import db from "../database/db.js";
import userService from "./user.service.js";

class ChatService {
    async sendMessage({ receiverId, receiverType, data, senderId }) {
        const sender = await userService.findUserByUsername(senderId);

        if (!sender) throw new Error(`Sender with id: ${senderId} not found`);

        const receiver = await userService.findUserByUsername(receiverId);
        if (!receiver)
            throw new Error(`Receiver with id: ${receiverId} not found`);

        const isFriend = await userService.isFriend(receiverId, senderId);
        if (!isFriend) {
            throw new Error(`${senderId} and ${receiverId} are not friends`);
        }

        const newMessage = await db.Message.create({
            senderId,
            receiverId,
            receiverType,
            data,
            id: crypto.randomUUID(),
        });
        return newMessage;
    }

    async getMessage({ user1, user2, page, limit }) {
        const offset = (page - 1) * limit;
        const messages = await db.Message.findAll({
            limit: limit,
            offset: offset,
            where: {
                [Op.or]: [
                    { senderId: user1, receiverId: user2 },
                    { senderId: user2, receiverId: user1 },
                ],
            },
            order: [["createdAt", "DESC"]],
        });

        const totalMessages = await db.Message.count({
            where: {
                [Op.or]: [
                    { senderId: user1, receiverId: user2 },
                    { senderId: user2, receiverId: user1 },
                ],
            },
        });

        const totalPage = Math.ceil(totalMessages / limit);
        return {
            messages: messages,
            currentPage: page,
            totalPage: totalPage,
            messageCount: totalMessages,
        };
    }

    async getLatestMessage({ user1, user2 }) {
        const message = await db.Message.findOne({
            limit: 1,
            where: {
                [Op.or]: [
                    { senderId: user1, receiverId: user2 },
                    { senderId: user2, receiverId: user1 },
                ],
            },
            order: [["createdAt", "DESC"]],
        });
        return message;
    }

    async getAllChat(username) {
        // get all friend of user
        const friends = await userService.getFriends(username);

        // get chat
        const data = await Promise.all(
            friends.map(async (friend) => {
                const latestMessage = await this.getLatestMessage({
                    user1: username,
                    user2: friend.username,
                });
                return {
                    friend,
                    latestMessage,
                };
            })
        );

        return data;
    }
}

export default new ChatService();
