import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRoute from "./Routes/userRoute";
import chatRoute from "./Routes/chatRoute";
import messageRoute from "./Routes/messageRoute";


const app = express();
require("dotenv").config()

app.use(express.json());
app.use(cors());
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);
app.use('/api/users/visitorRegister', userRoute);

// Read datas
app.get("/", (_req: any, _res: any) => {
    _res.send("Welcome to MSL Relay chat application!");
});

const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI || 'undifined';

mongoose.connect(uri).then(() => {
    console.log("MongoDB connection established.")
}).catch((error: any) => {
    console.log("MongoDB connection failed => " + error.message)
});

app.listen(port, () => {
    console.log(`Server running on port...: ${port}`);
});
