import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import userController from "../controller/user.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/info/:name", userController.getUserInfo);
router.get("/add-friend/request/:name", userController.requestAddFriend);
router.get("/add-friend/accepted/:name", userController.acceptedFriend);
router.get("/add-friend/reject/:name", userController.rejectedFriend);
router.get("/friends/pending", userController.getPendingFriends);

router.get("/friends", userController.getFriends);
router.get("/suggestions", userController.getSuggestionUser);

router.get("/status/:username", userController.getUserStatus);

export default router;
