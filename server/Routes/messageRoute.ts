import express from "express";

import { createMessage, getMessages } from "../Controllers/messageController";

const router = express.Router();

router.post("/", createMessage);
router.get("/:chatId", getMessages)

export default router;