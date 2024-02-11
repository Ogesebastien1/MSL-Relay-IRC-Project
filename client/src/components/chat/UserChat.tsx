import { Stack } from "react-bootstrap";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import avatar from "../../../assets/avatar.svg"
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";

interface User {
    _id: string;
    name: string;
}

interface Chat {
    _id: string;
    members: string[];
    name: string;
}

interface UserChatProps {
    chat: Chat;
    user: User | null;
}

interface OnlineUser {
    userId: string;
    socketId: string;
}

const UserChat: React.FC<UserChatProps> = ({ chat, user }) => {

    if (user) {
        const {recipientUser} = useFetchRecipientUser(chat, user);
        const chatContext = useContext(ChatContext)
        if (!chatContext) {
            console.error("ChatContext not available");
            return null;
        }
        const {onlineUsers} = chatContext;
        const isOnline = onlineUsers?.some((onlineUser:OnlineUser)=>{ return onlineUser?.userId === recipientUser?._id})

        return (
            <Stack direction="horizontal" gap={3} className="user-card align-items-center p-2 justify-content-between" role ="button">
                <div className="d-flex">
                    <div className="me-2">
                        <img src={avatar} height="35px"/>
                    </div>
                    <div className="text-content">
                        <div className="name">{recipientUser?.name}</div>
                        <div className="text">Text Message</div>
                    </div>
                </div>
                <div className="d-flex flex-column align-items-end">
                    <div className="date">
                        12/12/2024
                    </div>
                    <div className="this-user-notifications">2</div>
                    <span className={isOnline ? "user-online" : ""}></span>
                </div>
            </Stack>
        );
    }

}

export default UserChat;