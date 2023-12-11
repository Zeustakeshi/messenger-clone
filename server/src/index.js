import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { initDatabase } from "./database/db.js";
import socketAuthMiddleware from "./middleware/socket.auth.middleware.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import chatRouter from "./routes/chat.route.js";
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

    const user = userOnlineService.getUserInfo(socket);

    user.friends.forEach((friend) => {
        socket.broadcast
            .to(friend)
            .emit("friend-online", { username: user.username });

        socket.to(user.username).emit("friend-online", { username: friend });
    });

    socket.on("disconnect", async (reason) => {
        user.friends.forEach((friend) => {
            socket.broadcast
                .to(friend)
                .emit("friend-offline", { username: user.username });
        });
        await userOnlineService.removeUserOnline(socket);
        console.log("user disconnected:" + reason);
    });
});

const port = process.env.PORT || 3000;

server.listen(port, async () => {
    await initDatabase();
    console.log(`server running on ${port}`);
});
