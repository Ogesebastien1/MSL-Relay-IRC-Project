import express from "express";

const {createChat, findUserChats, findChat, addUser} = require("../Controllers/chatController");

const router = express.Router();

router.post("/", createChat);
router.get("/:userId", findUserChats);
router.get("/find/:firstId/:secondId", findChat);
router.post("/addUser", addUser);

export default router;