import express from "express";
const {registerUser, loginUser, findUser, getUsers, visitorRegister, visitorChangeName} = require("../Controllers/userController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/visitorRegister", visitorRegister);
router.post("/login", loginUser);
router.post("/visitorChangeName", visitorChangeName);
router.get("/find/:userId", findUser);
router.get("/", getUsers);

export default router;