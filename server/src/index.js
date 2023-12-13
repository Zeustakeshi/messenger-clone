import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { initDatabase } from "./database/db.js";
import socketAuthMiddleware from "./middleware/socket.auth.middleware.js";
import authRouter from "./routes/auth.route.js";
import chatRouter from "./routes/chat.route.js";
import userRouter from "./routes/user.route.js";
import userOnlineService from "./services/userOnline.service.js";

const app = express({});

/** App Middleware */
dotenv.config();
app.use(
    cors({
        origin: "*",
    })
);
app.use(express.json());

/** App Routing */
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);

/** Socket  */
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

/** Use Socket middlewate */
io.use(socketAuthMiddleware);

/** Socket even register */

io.on("connection", async (socket) => {
    socket.join(socket.user.username);
    await userOnlineService.newUserOnline(socket);

    let user = userOnlineService.getUserInfo(socket.user.username);
    socket.emit("get-online-friends", { friends: user.friends });

    /** Notify online for all friend */
    user.friends.forEach((friend) => {
        socket.broadcast
            .to(friend)
            .emit("friend-online", { username: user.username });

        socket.to(user.username).emit("friend-online", { username: friend });
    });

    /** Add friend */
    socket.on("add-friend", ({ friend, user }) => {
        socket.to(friend.username).emit("request-add-friend", user);
    });

    socket.on("accept-friend", ({ user, friend }) => {
        socket.to(friend.username).emit("accepted-friend", {
            ...user,
            status: userOnlineService.getUserStatus(user.username),
        });
        socket.emit("accepted-friend", {
            ...friend,
            status: userOnlineService.getUserStatus(friend.username),
        });

        user = userOnlineService.updateFriendOnline(
            socket.user.username,
            friend.username
        );
        userOnlineService.updateFriendOnline(
            friend.username,
            socket.user.username
        );
    });

    /** SEND MESSAGE */
    socket.on("send-message", (message) => {
        socket.to(message.receiverId).emit("receive-message", message);
        socket.emit("receive-message", message);
    });

    /** TYPING STATE */

    socket.on("typing", ({ receiverId, senderId }) => {
        socket.to(receiverId).emit("typing", senderId);
    });

    socket.on("stop-typing", ({ receiverId, senderId }) => {
        socket.to(receiverId).emit("stop-typing", senderId);
    });

    /** CALL */

    /** INIT CALL */
    socket.on("call-to", (to) => {
        socket.to(to).emit("receive-call", socket.user.username);
        userOnlineService.setCallTo(socket.user.username, to);
    });
    /** START CALL */
    socket.on("accept-call", (to) => {
        socket.to(to).emit("accept-call", { from: socket.user.username });
    });

    socket.on("send-peer-id", ({ to, peerId }) => {
        socket
            .to(to)
            .emit("receivce-peer-id", { peerId, from: socket.user.username });
    });

    /** END CALL */
    socket.on("end-call", ({ to, reason }) => {
        socket
            .to(to)
            .emit("receivce-end-call", { from: socket.user.username, reason });
    });

    /** DISCONECT */
    socket.on("disconnect", async (reason) => {
        if (userOnlineService.getCallTo(socket.user.username)) {
            socket
                .to(userOnlineService.getCallTo(socket.user.username))
                .emit("receivce-end-call", {
                    from: socket.user.username,
                    reason: "user disconnect",
                });
        }

        user.friends.forEach((friend) => {
            socket.broadcast
                .to(friend)
                .emit("friend-offline", { username: user.username });
        });
        await userOnlineService.removeUserOnline(socket);
        // console.log("user disconnected:" + reason);
    });
});

const port = process.env.PORT || 3000;

server.listen(port, async () => {
    await initDatabase();
    console.log(`server running on ${port}`);
});
