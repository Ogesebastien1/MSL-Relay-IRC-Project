import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

interface OnlineUser {
    userId: string;
    socketId: string;
}

const PotentialChats = () => {
    
    const chatContext = useContext(ChatContext);

    if (!chatContext) {
        // Handle the case when chatContext is null
        console.error("ChatContext not available");
        return null;
    }

    const {user} = useContext(AuthContext);

    // Type assertion: tell TypeScript that chatContext is not null here.
    const {potentialChats, createChat, onlineUsers} = chatContext!;

    return (
        <>
            <div className="all-users">
                {potentialChats && potentialChats.map((u, index) => {
                    return user && (
                    <div className="single-user" key={index} onClick={()=> createChat(user._id, u._id)}>
                        {u.name}
                        <span className={ onlineUsers?.some((onlineUser:OnlineUser)=>{ return onlineUser?.userId === u._id}) ? "user-online" : ""}></span>
                    </div>
                    );
                })}
            </div>
        </>
    );
};

export default PotentialChats;
