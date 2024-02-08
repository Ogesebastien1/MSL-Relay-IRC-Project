import { createContext, useState, ReactNode, useEffect, useCallback } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";

interface Chat {
    _id: string;
    members: string[];
    name: string;
    chat: string;
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

interface ChatContextType {
    user:User | null;
    userChats: Chat[] | null; 
    isUserChatsLoading: boolean;
    userChatsError: ErrorState | null; 
    potentialChats: Array<Chat>;
    createChat: (firstId: string, secondId: string) => Promise<void>;
    updateCurrentChat: (chat: Chat) => void;
    messages:Message | null;
    isMessageLoading: boolean;
    messagesError: ErrorState | null;
    currentChat: Chat | null;
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
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [userChatsError, setUserChatsError] = useState<ErrorState | null>(null);
    const [potentialChats, setPotentialChats] = useState<Array<Chat>>([]);
    const [currentChat, setCurrentChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message | null>(null);
    const [isMessageLoading, setIsMessageLoading] = useState(false);
    const [messagesError, setMessagesError] = useState<ErrorState | null>(null);

    console.log("messages", messages);

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
            currentChat
         }}>
            {children}
        </ChatContext.Provider>
    );
}