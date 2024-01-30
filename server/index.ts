import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
require("dotenv").config()

app.use(express.json());
app.use(cors());


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