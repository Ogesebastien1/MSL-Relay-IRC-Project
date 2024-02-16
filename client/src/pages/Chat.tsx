import { Key, useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { Container, Stack } from 'react-bootstrap';
import UserChat  from "../components/chat/UserChat";
import { AuthContext } from "../context/AuthContext";
import PotentialChats from "../components/chat/PotentialChats";
import ChatBox from "../components/chat/ChatBox";


interface Chat {
    _id: string;
    members: string[];
    chatName: string;
}

const Chat = () => {

    const context = useContext(ChatContext);
    const { userChats, isUserChatsLoading, updateCurrentChat} = context!;
    useContext(ChatContext);
    const { user } = useContext(AuthContext)
    
    return ( 
        
        <Container>
            <PotentialChats />
            {userChats && userChats?.length < 1 ? null :(
                <Stack direction="horizontal" gap={4} className="align-items-start">
                    <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
                        {isUserChatsLoading && <p>Loading chats...</p>}
                        {userChats?.map((chat: Chat, index: Key) => {
                            return ( chat &&
                                <div key={index} onClick={()=>updateCurrentChat(chat)}>
                                    <UserChat chat={chat} user={user} />
                                </div>
                            );
                        })}
                    </Stack>
                    <ChatBox />
                </Stack>
            )}
        </Container>
    );
}
 
export default Chat;