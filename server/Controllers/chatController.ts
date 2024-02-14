import chatModel from "../Models/chatModel";

// createChat
const createChat = async (req: any, res: any) => {

    const {firstId, secondId} = req.body;

    try {
        const chat = await chatModel.findOne({
            members: {$all:[firstId, secondId]}
        });

        if (chat) return res.status(200).json(chat);

        const newChat = new chatModel({
            members: [firstId, secondId]
        });

        const response = await newChat.save();

        res.status(200).json(response);

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}
// findUserChats
const findUserChats = async (req:any, res:any) => {
    const userId = req.params.userId;

    try {
        const chats = await chatModel.find({
            members: {$in: [userId]}
        });

        res.status(200).json(chats);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

// findChat
const findChat = async (req:any, res:any) => {
    const {firstId, secondId} = req.params;

    try {
        const chat = await chatModel.find({
            members: {$all: [firstId, secondId]},
        });

        res.status(200).json(chat);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

// addUser
const addUser = async (req:any, res:any) => {
    const {newUserId, chatId} = req.body;

    try {
        const chat = await chatModel.findOne({
            _id: chatId
        });

        if (!chat) return res.status(400).json("Room not existant!");

        // Check if user is already a member of the chatroom to avoid duplicates
        if (chat.members.includes(newUserId)) {
            return res.status(400).json("User already in the room!");
        }

        chat.members.push(newUserId);

        const updatedChat = await chat.save();
        res.status(200).json(updatedChat);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
}

module.exports = { createChat, findUserChats, findChat, addUser };