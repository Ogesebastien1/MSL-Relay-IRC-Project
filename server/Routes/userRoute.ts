import express from "express";
const {registerUser, loginUser, findUser, getUsers} = require("../Controllers/userController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/find/:userId", findUser);
router.get("/", getUsers);

export default router;