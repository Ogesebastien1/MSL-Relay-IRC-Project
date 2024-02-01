import express from "express";
const {registerUser, loginUser} = require("../Controllers/userController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;