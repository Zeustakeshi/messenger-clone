import Router from "express";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/rooms", (req, res) => {});
router.post("/join-room", (req, res) => {});
router.post("/room/new");
router.get("/messages/:roomId");

router.post("/message/new");

export default router;
