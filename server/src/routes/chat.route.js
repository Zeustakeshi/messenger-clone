import Router from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import chatController from "../controller/chat.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/messages/send", chatController.sendMessage);
router.get("/messages/:chatId", chatController.getMessages);
router.get("/messages/latest/:chatId", chatController.getLatestMessage);
router.get("/all", chatController.getAllChat);
export default router;
