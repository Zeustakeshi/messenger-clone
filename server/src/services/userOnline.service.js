import { USER_STATUS } from "../utils/user.util.js";
import userService from "./user.service.js";

export class UserOnlineService {
    constructor() {
        this.users = {};
    }

    async newUserOnline(socket) {
        try {
            const username = socket.user.username;
            const friendOnlines = await this.getUserFriendOnlines(socket);

            this.users[username] = {
                ...socket.user,
                socketId: socket.id,
                friends: friendOnlines,
                callTo: null,
            };
            await userService.updateStatus(username, USER_STATUS.ONLINE);
        } catch (error) {
            console.log(error.message);
        }
    }

    getUserInfo(username) {
        return this.users[username];
    }

    async removeUserOnline(socket) {
        const username = socket.user.username;
        delete this.users[username];
        try {
            await userService.updateStatus(username, USER_STATUS.OFFLINE);
        } catch (error) {
            console.log(error.message);
        }
    }

    async getUserFriendOnlines(socket) {
        try {
            let friends = await userService.getFriendOnines(
                socket.user.username
            );
            friends = friends.map((friend) => friend.username);
            return friends;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    setUserInfo(username, callback) {
        if (!this.users[username]) throw new Error("user online not found!");
        return (this.users[username] = callback(this.users[username]));
    }

    updateFriendOnline(username, friendName) {
        try {
            return this.setUserInfo(username, (prev) => {
                return {
                    ...prev,
                    friends: [...prev.friends, friendName],
                };
            });
        } catch (error) {
            console.log(error);
        }
    }

    getUserStatus(username) {
        if (this.getUserInfo(username)) {
            return USER_STATUS.ONLINE;
        } else {
            return USER_STATUS.OFFLINE;
        }
    }

    getCallTo(username) {
        return this.users[username]?.callTo;
    }

    setCallTo(username, to) {
        if (!this.users[username]) return;
        this.users[username].callTo = to;
    }
}

export default new UserOnlineService();
