import crypto from "crypto";
import { Op } from "sequelize";
import db from "../database/db.js";
import { FriendStatus } from "../utils/friend.util.js";
import { USER_STATUS } from "../utils/user.util.js";

class UserService {
    async findUserByUsername(username) {
        const data = await db.User.findByPk(username);
        return data;
    }

    async isFriend(username, ortherUsername) {
        const friend = await db.Friend.findOne({
            where: {
                [Op.or]: [
                    { username1: username, username2: ortherUsername },
                    { username1: ortherUsername, username2: username },
                ],
            },
        });
        return !!friend;
    }

    async getFriends(username) {
        const user = await this.findUserByUsername(username);
        if (!user) throw new Error("user not found");

        const friends = await Promise.all([
            db.Friend.findAll({
                model: db.Friend,
                where: {
                    username1: username,
                    type: FriendStatus.ACCEPTED,
                },
                attributes: [],
                include: [
                    {
                        model: db.User,
                        on: {
                            username: {
                                [Op.eq]: db.Sequelize.col("Friend.username2"),
                            },
                        },
                        attributes: ["username", "avatar", "status"],
                    },
                ],
            }),
            db.Friend.findAll({
                model: db.Friend,
                where: {
                    username2: username,
                    type: FriendStatus.ACCEPTED,
                },
                attributes: [],
                include: [
                    {
                        model: db.User,
                        on: {
                            username: {
                                [Op.eq]: db.Sequelize.col("Friend.username1"),
                            },
                        },
                        attributes: ["username", "avatar", "status"],
                    },
                ],
            }),
        ]);
        return friends.flat(2).map((friend) => friend.User.dataValues);
    }

    async getFriendOnines(username) {
        const user = await this.findUserByUsername(username);
        if (!user) throw new Error("user not found");

        const friends = await Promise.all([
            db.Friend.findAll({
                where: {
                    username1: username,
                    type: FriendStatus.ACCEPTED,
                },
                attributes: [],
                include: [
                    {
                        model: db.User,
                        on: {
                            username: {
                                [Op.eq]: db.Sequelize.col("Friend.username2"),
                            },
                            status: USER_STATUS.ONLINE,
                        },
                        attributes: ["username", "avatar", "status"],
                    },
                ],
            }),
            db.Friend.findAll({
                where: {
                    username2: username,
                    type: FriendStatus.ACCEPTED,
                },
                attributes: [],
                include: [
                    {
                        model: db.User,
                        on: {
                            username: {
                                [Op.eq]: db.Sequelize.col("Friend.username1"),
                            },
                            status: USER_STATUS.ONLINE,
                        },
                        attributes: ["username", "avatar", "status"],
                    },
                ],
            }),
        ]);

        return friends.flat(2).reduce((prev, friend) => {
            if (friend.dataValues.User) {
                return [...prev, friend.dataValues.User.dataValues];
            } else {
                return prev;
            }
        }, []);
    }

    async getSuggestionUser(username) {
        const allfriend = await db.Friend.findAll({
            where: {
                [Op.or]: [{ username1: username }, { username2: username }],
            },
            attributes: ["username1", "username2"],
        });

        const friends = allfriend.reduce((prev, friend) => {
            const { username1, username2 } = friend.dataValues;
            return [...prev, username1, username2];
        }, []);

        const sugggestions = await db.User.findAll({
            where: {
                username: {
                    [Op.notIn]: [username, ...friends],
                },
            },
            attributes: ["username", "avatar", "status"],
            limit: 10,
        });
        return sugggestions;
    }

    async getPendingFriends(username) {
        const friends = await db.Friend.findAll({
            model: db.Friend,
            where: {
                [Op.or]: [{ username2: username }],
                type: FriendStatus.PENDING,
            },
            attributes: [],
            include: [
                {
                    model: db.User,
                    on: {
                        username: {
                            [Op.eq]: db.Sequelize.col("Friend.username1"),
                        },
                    },
                    attributes: ["username", "avatar", "status"],
                },
            ],
        });

        return friends.map((friend) => {
            return friend.dataValues.User;
        });
    }

    async requestAddFriend(username, ortherUsername) {
        const user = await this.findUserByUsername(username);
        if (!user) throw new Error("user not found");
        const ortherUser = await this.findUserByUsername(ortherUsername);
        if (!ortherUser) throw new Error("ortherUser not found");

        /// check already friends

        const isFriend = await db.Friend.findOne({
            where: {
                [Op.or]: [
                    { username1: username, username2: ortherUsername },
                    { username1: ortherUsername, username2: username },
                ],
            },
        });

        if (isFriend) {
            throw new Error(
                `request already sended to ${ortherUsername} or  user ${username} and ${ortherUsername} is already friends`
            );
        }

        await db.Friend.create({
            id: crypto.randomUUID(),
            type: FriendStatus.PENDING,
            username1: username,
            username2: ortherUsername,
        });
    }

    async acceptedFriend(username, ortherUsername) {
        const friend = await db.Friend.findOne({
            where: {
                [Op.or]: [
                    { username1: username, username2: ortherUsername },
                    { username1: ortherUsername, username2: username },
                ],
                type: FriendStatus.PENDING,
            },
        });

        if (!friend) {
            throw new Error(
                `Requst get friend not found! or  ${username} and ${ortherUsername} is already friends`
            );
        }

        await friend.update({ type: FriendStatus.ACCEPTED });
    }

    async rejectedFriend(username, ortherUsername) {
        await db.Friend.destroy({
            where: {
                [Op.or]: [
                    { username1: username, username2: ortherUsername },
                    { username1: ortherUsername, username2: username },
                ],
            },
        });
    }

    async updateStatus(username, status) {
        try {
            const user = await this.findUserByUsername(username);
            user.status = status;

            await user.save();
        } catch (error) {
            console.log("user not found");
        }
    }

    async getUserStatus(username) {
        const status = await db.User.findByPk(username, {
            attributes: ["status"],
        });
        return status;
    }

    async getUserInfo(username) {
        const user = await db.User.findByPk(username, {
            attributes: ["username", "avatar", "status"],
        });

        return user;
    }
}

export default new UserService();
