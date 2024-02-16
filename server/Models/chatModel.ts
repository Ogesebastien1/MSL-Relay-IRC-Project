import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
    {
        members: Array,
        chatName: {type: String, required: false, minlength: 3, maxlength: 30},
    },
    {
        timestamps: true,
    }
);

const chatModel = mongoose.model("Chat", chatSchema);

export default chatModel;