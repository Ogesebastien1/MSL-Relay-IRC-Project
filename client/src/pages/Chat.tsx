import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";

const Chat = () => {

    const context = useContext(ChatContext);

    if (!context) {
        return <div>Loading...</div>;
    }

    const { userChats, isUserChatsLoading, userChatsError } = context;


    console.log("UserChats", userChats);

    return ( <>Chat</> );
}
 
export default Chat;