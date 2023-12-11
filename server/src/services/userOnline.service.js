import { USER_STATUS } from "../utils/user.util.js";
import userService from "./user.service.js";

export class UserOnlineService {
    constructor() {
        this.users = {};
    }

    async newUserOnline(socket) {
        const username = socket.user.username;
        this.users[username] = {
            ...socket.user,
            socketId: socket.id,
            friends: await this.getUserFriendOnlines(socket),
        };
        await userService.updateStatus(username, USER_STATUS.ONLINE);
    }

    getUserInfo(socket) {
        return this.users[socket.user.username];
    }

    async removeUserOnline(socket) {
        const username = socket.user.username;
        delete this.users[username];
        await userService.updateStatus(username, USER_STATUS.OFFLINE);
    }

    async getUserFriendOnlines(socket) {
        let friends = await userService.getFriends(socket.user.username);
        friends = friends.map((friend) => friend.username);

        const onlines = [];

        for (const username in this.users) {
            if (friends.includes(username)) onlines.push(username);
        }
        return onlines;
    }
}

export default new UserOnlineService();
