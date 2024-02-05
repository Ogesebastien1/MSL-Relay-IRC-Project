import { Key, useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { Container } from "react-bootstrap/lib/Tab";
import { Stack } from "react-bootstrap";
import UserChat from "../components/chat/UserChat";

const Chat = () => {

    const context = useContext(ChatContext);

    const { userChats, isUserChatsLoading, userChatsError, user } = context!;
    useContext(ChatContext);

    return ( 
        <Container>
            {userChats?.length < 1 ? null :(
                <Stack direction="horizontal" gap={4} className="align-items-start">
                    <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
                        {isUserChatsLoading && <p>Loading chats...</p>}
                        {userChats?.map((chat: any, index: Key | null | undefined) => {
                            return (
                                <div key={index}>
                                    <UserChat chat={chat} user={user} />
                                </div>
                            );
                        })};
                    </Stack>
                    <p>ChatBox</p>
                </Stack>
            )}
        </Container>
    );
}
 
export default Chat;