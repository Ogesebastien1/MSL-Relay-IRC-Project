import express from "express";

const {createChat, deleteChat, findUserChats, findChat, addUser, joinChat, quitChat, listChat} = require("../Controllers/chatController");

const router = express.Router();

router.post("/", createChat);
router.post("/delete", deleteChat);
router.post("/join", joinChat);
router.post("/quit", quitChat);
router.get("/list", listChat)
router.get("/:userId", findUserChats);
router.get("/find/:firstId/:secondId", findChat);
router.post("/addUser", addUser);


export default router;