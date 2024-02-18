import chatModel from "../Models/chatModel";

// createChat
const createChat = async (req: any, res: any) => {

    const {firstId, secondId, chatName} = req.body;

    try {
        
        if (secondId && !chatName){
            const chat = await chatModel.findOne({
                members: {$all:[firstId, secondId]}
            });
    
            if (chat) return res.status(200).json(chat);
            const newChat = new chatModel({
                members: [firstId, secondId]
            });
            const response = await newChat.save();
            res.status(200).json(response);
        }else if(!secondId && chatName){
            const chat = await chatModel.findOne({
                members: {$all:[firstId]},
                chatName: chatName
            });
    
            if (chat) return res.status(200).json(chat);
            const newChat = new chatModel({
                members: [firstId],
                chatName: chatName
            });
            const response = await newChat.save();
            res.status(200).json(response);
        }

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

//deleteChat
const deleteChat = async (req:any, res:any)=>{
    const {chatName} = req.body;
    
    try {
        const result = await chatModel.deleteOne({ chatName: chatName });

        // if a document was not deleted
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "No existent chat with the given name." });
        }

        res.status(200).json({ message: "Chat deleted successfully." });

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

//joinChat
const joinChat = async (req:any, res:any)=>{
    const { chatName, userId } = req.body;

    try {
        // Check if the chat exists in the database
        const existingChat = await chatModel.findOne({ chatName : chatName });

        // If the chat doesn't exist, return a 404 error
        if (!existingChat) {
            return res.status(404).json({ message: "No chat found with the given name." });
        }
 
        // Check if the user is already in the chat
        if (existingChat.members.includes(userId)) {
            return res.status(400).json({ message: "User is already in the chat." });
        }

        existingChat.members.push(userId); // Add user to chat
        await existingChat.save(); // Save changes

        res.status(200).json(existingChat);

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}
//quitChat
const quitChat = async (req:any, res:any)=>{
    const { chatName, userId } = req.body;

    try {
        // Check if the chat exists in the database
        const existingChat = await chatModel.findOne({ chatName });

        // If the chat doesn't exist, return a 404 error
        if (!existingChat) {
            return res.status(404).json({ message: "No chat found with the given name." });
        }

        const index = existingChat.members.indexOf(userId);
        if (index !== -1) {
            existingChat.members.splice(index, 1); // Remove userId from members array
            await existingChat.save(); // Save changes
        } else {
            return res.status(400).json({ message: "User is not a member of this chat." });
        }
        res.status(200).json(existingChat);

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

const listChat = async (req: any, res: any) => {
    const { chatName } = req.body;

    try {
        // If the chat exists, retrieve the list of chats
        const chats = await chatModel.find({ chatName: { $exists: true }});;

        // Send the list of chats to the front end
        res.status(200).json( chats );
    } catch (error) {
        console.error('Error listing chats:', error);
        res.status(500).json({ message: "An error occurred while listing chats." });
    }
};





module.exports = { createChat, deleteChat, findUserChats, findChat, addUser, joinChat, quitChat, listChat};