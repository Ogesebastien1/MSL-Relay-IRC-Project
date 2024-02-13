import { createContext, useState, ReactNode, useEffect, useCallback } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";
import { io, Socket } from "socket.io-client";

interface Chat {
    name: string;
    _id: string;
    members: string[];
}

interface Message {
    [x: string]: any; // needed for map() in ChatBox.tsx
    _id: string;
    senderId: string;
    text: string;
    creatAt: Date;
}

interface User {
    _id: string;
    name: string;
}

interface OnlineUser {
    userId: string;
    socketId: string;
}

interface ChatContextType {
    user:User | null;
    userChats: Chat[] | null; 
    isUserChatsLoading: boolean;
    userChatsError: ErrorState | null; 
    potentialChats: Array<Chat>;
    createChat: (firstId: string, secondId: string) => Promise<void>;
    updateCurrentChat: (chat: Chat) => void;
    messages:Message[] | null;
    isMessageLoading: boolean;
    messagesError: ErrorState | null;
    currentChat: Chat | null;
    sendTextMessage: (
        textMessage: string, 
        sender: User, 
        currentChatId: string, 
        setTextMessage: React.Dispatch<React.SetStateAction<string>>
    ) => Promise<void>;
    onlineUsers: OnlineUser[] | null;
    handleUserSelect: (newUserId: string) => Promise<void>;
    handleToggleAddUserModal: (() => Promise<void>) | undefined;
    showAddUserModal: boolean;
}

interface ErrorState {
    message: string;
  }

export const ChatContext = createContext<ChatContextType | null>(null);


interface ChatContextProviderProps {
    children: ReactNode;
    user: User | null;
}

export const ChatContextProvider: React.FC<ChatContextProviderProps> = ({ children, user }) => {
    const [userChats, setUserChats] = useState<Chat[] | null>(null);
    const [isUserChatsLoading, setIsUserChatsLoading] = useState<boolean>(false);
    const [userChatsError, setUserChatsError] = useState<ErrorState | null>(null);
    const [potentialChats, setPotentialChats] = useState<Array<Chat>>([]);
    const [currentChat, setCurrentChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[] | null>([]);
    const [isMessageLoading, setIsMessageLoading] = useState<boolean>(false);
    const [messagesError, setMessagesError] = useState<ErrorState | null>(null);
    const [textMessage, setTextMessage] = useState<string>("");
    const [sendTextMessageError, setSendTextMessageError] = useState<ErrorState | null>(null);
    const [newMessage, setNewMessage] = useState<Message | null>(null);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<OnlineUser[] | null>([]);
    const [showAddUserModal, setShowAddUserModal] = useState(false);

    // initial socket ---
    useEffect(() => {
        const newSocket = io("http://localhost:3051");
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        }
        // [user] means, every time we have a new user, a newSocket will be created
    }, [user]);

    // add online users
    useEffect(()=>{
        if (socket === null) return
        socket?.on("getOnlineUsers", (res)=>{
            setOnlineUsers(res);
        });
        socket?.emit("addUser", user?._id);

        return () => {
            socket.off("getOnlineUsers");
        };
    }, [socket]);

    // send real-time message
    useEffect(()=>{
        if (socket === null) return

        const recipientId = currentChat?.members?.find((id: string) => id !==user?._id);
        socket.emit("sendMessage", {...newMessage, recipientId})
    }, [newMessage]);

    // recieve real-time message
    useEffect(()=>{
        if (socket === null) return
        
        socket.on("getMessage", res => {
            if (currentChat?._id !== res.chatId) return 
            
            setMessages((prev) => prev ? [...prev, res] : [res]);
        });

        return  () => {
            socket.off("getMessage");
        }

    }, [socket, currentChat]);

    useEffect(() => {
        async function fetchData() {
            // First, check if we have a user and load the user's chats:
            if (user?._id) {
                setIsUserChatsLoading(true);

                try {
                    const chatsResponse = await getRequest(`${baseUrl}/chats/${user._id}`);
                    setUserChats(chatsResponse);
                } catch (error: any) {
                    setUserChatsError({ message: error.message || 'An unknown error occurred' });
                  }

                setIsUserChatsLoading(false);
            }

            // Then, load all users
            try {
                const usersResponse = await getRequest(`${baseUrl}/users`);
                if (usersResponse.error) {
                    throw new Error(usersResponse.error);
                }

                // Finally, filter potential chats based on loaded user chats
                const filteredChats = usersResponse.filter((u: {name: string; _id: string; }) => {
                    if (user && user._id === u._id) {
                        return false;
                    }

                    // Check if a chat with the user already exists
                    const isChatCreated = userChats?.some(chat => {
                        const chatExists = chat.members.includes(u._id);
                        return chatExists;
                    });
                    return !isChatCreated;
                });
                setPotentialChats(filteredChats);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        }

        fetchData();
    }, [user]);

    useEffect(()=>{
        const getMessages = async()=>{

            setIsMessageLoading(true);
            setMessagesError(null);

            const response = await getRequest(`${baseUrl}/messages/${currentChat?._id}`);
            
            setIsMessageLoading(false);

            if (response.error){
                return setMessagesError(response);
            }
            setMessages(response);
            
        }
        getMessages();
    }, [currentChat]);

    const sendTextMessage = useCallback(async (textMessage: string, sender: User, currentChatId: string, setTextMessage: React.Dispatch<React.SetStateAction<string>>) => {
        if (!textMessage) console.log("you must type something...");

        const response = await postRequest(`${baseUrl}/messages`, JSON.stringify({
            chatId: currentChatId,
            senderId: sender._id,
            text: textMessage
        }));

        if (response.error) {
            return setSendTextMessageError(response);
        };

        setNewMessage(response);
        setMessages((prev) => prev ? [...prev, response] : [response]);
        setTextMessage("");
    }, [])

    const updateCurrentChat = useCallback(((chat: Chat)=>{
        setCurrentChat(chat);
    }), []);

    // creating a chat
    const createChat = useCallback(async (firstId: string, secondId: string) => {
        // Construct an object that includes both firstId and secondId
        const chatData = {
            firstId: firstId,
            secondId: secondId
        };

        // Stringify the object to send as the body of POST request
        const response = await postRequest(`${baseUrl}/chats`, JSON.stringify(chatData));

        if (response.error) {
            return console.log("Error creating chat", response);
        }

        // Update the userChats state
        setUserChats((prev) => {
            // If prev is not null, spread it into a new array and add the new response
            // Otherwise, just initialize the array with the response
            return prev ? [...prev, response] : [response];
        });
    }, []);

    // toggle modal visibility
    const handleToggleAddUserModal = useCallback(async () => {
        setShowAddUserModal(!showAddUserModal);
    }, []);

    // add user in chat
    const handleUserSelect = useCallback( async (userId: string)=>{

        if (!currentChat?._id || !userId) {
            console.log("currentChat is null!")
            return;
        }
        const data = {
            chatId : currentChat._id,
            newUserId : userId
        }

        try {
            const response = await postRequest(`${baseUrl}/chats/addUser`, JSON.stringify(data));

            // Handle response
            if (response.error) {
                console.error("Failed to add user to chat:", response.error);
                setShowAddUserModal(false);
            } else {
                // Successfully added the user
                console.log("User added successfully:", response);

                // Close the modal
                setShowAddUserModal(false);

                setCurrentChat(prevChat => {
                    if (!prevChat) return null;

                    return {
                    ...prevChat,
                    members: [...prevChat.members, userId]
                    };
                });
            }
        } catch (error) {
            console.error("An error occurred while adding user to chat:", error);
        }
    }, [currentChat]);
    
    return (
        <ChatContext.Provider value={{ 
            userChats,
            isUserChatsLoading,
            userChatsError,
            potentialChats,
            user,
            createChat,
            updateCurrentChat,
            messages,
            isMessageLoading,
            messagesError,
            currentChat,
            sendTextMessage,
            onlineUsers,
            handleUserSelect,
            handleToggleAddUserModal,
            showAddUserModal
         }}>
            {children}
        </ChatContext.Provider>
    );
}