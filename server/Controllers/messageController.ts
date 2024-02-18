import messageModel from "../Models/messageModel";

// createMessage
export const createMessage = async(req : any, res : any) => {
    const {chatId, senderId, text, senderName} = req.body

    const message = new messageModel({
        chatId, senderId, text, senderName
    })

 try    {
        const response= await message.save()
        res.status(200).json(response);
    }   catch(error){
        console.log(error);
        res.status(500).json(error);
    }
};

// getMessages
export const getMessages= async (req : any, res : any) => {
    const {chatId} = req.params;

    try {
        const messages = await messageModel.find({chatId})
        res.status(200).json(messages);
    }   catch(error){
        console.log(error);
        res.status(500).json(error);
    }
};

module.exports = { createMessage, getMessages };



