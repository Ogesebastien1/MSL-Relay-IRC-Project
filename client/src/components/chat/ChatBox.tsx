import { Key, useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";
import moment from "moment";
import InputEmoji from "react-input-emoji";
import { Button } from "react-bootstrap";
import UserSelectionModal from "../UserSelectionModal";
import avatar from "../../../assets/avatar_white.png"
import { Message } from '../../types/ChatContextTypes';

const ChatBox = () => {

    const {user, changeNickname} = useContext(AuthContext);
    const { currentChat, messages, isMessageLoading, sendTextMessage, potentialChats, handleUserSelect, showAddUserModal, handleToggleAddUserModal, createChat, deleteChat, joinChat, quitChat } = useContext(ChatContext) ?? {};
    const {recipientUser} = useFetchRecipientUser(currentChat, user);
    const [textMessage, setTextMessage] = useState("");

    if (!recipientUser){
        return (
            <p style={{textAlign: "center", width: "100%"}}>
                No conservation selected yet ...
            </p>
        )
    };

    if (isMessageLoading){
        return (
            <p style={{textAlign: "center", width: "100%"}}>Loading Chat...</p>
        )
    }

    const messageTreatment = async () => {
        if (!textMessage || textMessage.length === 0) return false;
        
        let [command, ...args] = textMessage.split(' ');
        if (sendTextMessage && user && currentChat) {
            if (!command.startsWith('/')){
                await sendTextMessage(textMessage, user, currentChat._id, setTextMessage);
                return false;  
            } 
            let argument = args.join(" ");
        
            switch (command) {
    
                case '/create':
                    if (!argument) return false;
                    if (createChat) await createChat(user._id, undefined, argument)
                    setTextMessage('');
                    break;
                case '/delete':
                    if (!argument) return false;
                    if (deleteChat) await deleteChat(argument)
                    setTextMessage('');
                    break;
                case '/join':
                    if (!argument) return false;
                    if (joinChat) await joinChat(argument)
                    setTextMessage('');
                    break;
                case '/quit':
                    if (!argument) return false;
                    if (quitChat) await quitChat(argument)
                    setTextMessage('');
                break;
                case '/nick':
                    if (!argument) return false;
                    if (changeNickname) await changeNickname(argument)
                    setTextMessage('');
                break;

                default:
                    console.log("Unknown command:", command);
                    return false;  
            };
        }
    }

    return (
        <Stack gap={4} className="chat-box">
            <div className="chat-header">
                <strong>{currentChat?.chatName ? currentChat.chatName : recipientUser?.name}</strong>&nbsp;&nbsp;&nbsp;<Button onClick={handleToggleAddUserModal}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-plus-fill" viewBox="0 0 16 16">
                    <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                    <path fillRule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5"/>
                    </svg>
                </Button>
                <UserSelectionModal 
                isOpen={showAddUserModal} 
                onClose={handleToggleAddUserModal} 
                onUserSelect={handleUserSelect} 
                users={potentialChats ?? []} // Assuming potentialChats is an array of user objects
            />
            </div>
            <Stack gap={3} className="messages">
                {messages && messages.map((message: Message, index: Key)=> (
                    <Stack key={index} className={`${message?.senderId === user?._id ? "message self align-self-end flex-grow-0" : "message align-self-start flex-grow-0"}`}>
                        <span className="text-white bg-succes p-1 rounded fw-bold"><img src={avatar} height="20px"/>&nbsp;&nbsp;{ message?.senderName }</span>
                        <span>{message.text}</span>
                        <span className="message-footer">{moment(message.creatAt).calendar()}</span>
                    </Stack>
                ))}
            </Stack>
            <Stack direction="horizontal" gap={3} className="chat-input flex-grow-0">
                <InputEmoji value={textMessage} onChange={setTextMessage} fontFamily="nunito" borderColor="rgba(72, 112, 223, 0.2)"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            messageTreatment();
                        }
                    }}
                />
                <Button className="send-btn" onClick={() => {messageTreatment()}}> 
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send-fill" viewBox="0 0 16 16">
                        <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z"/>
                    </svg>
                </Button>
            </Stack>
        </Stack>
    )
}

export default ChatBox;