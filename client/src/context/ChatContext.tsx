import { createContext, useState, ReactNode, useEffect, useCallback } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";

interface Chat {
    _id: string;
    members: string[];
    name: string;
    chat: string;
}

interface User {
    _id: string;
    name: string;
}

interface ChatContextType {
    user:User | null;
    userChats: any; 
    isUserChatsLoading: boolean;
    userChatsError: any; 
    potentialChats: Array<Chat>;
    createChat: (firstId: string, secondId: string) => Promise<void>;
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

    useEffect(() => {
        async function fetchData() {
            console.log('Fetching data for user:', user);
            // First, check if we have a user and load the user's chats
            if (user?._id) {
                setIsUserChatsLoading(true);
                console.log(`Fetching chats for user ID: ${user._id}`);

                try {
                    const chatsResponse = await getRequest(`${baseUrl}/chats/${user._id}`);
                    setUserChats(chatsResponse);
                    console.log('Chats response:', chatsResponse);
                } catch (error: any) {
                    console.error('Error fetching user chats:', error);
                    setUserChatsError({ message: error.message || 'An unknown error occurred' });
                  }

                setIsUserChatsLoading(false);
            } else {
                console.log('No user ID found, skipping fetching chats.');
            }

            // Then, load all users
            try {
                console.log('Fetching all users');

                const usersResponse = await getRequest(`${baseUrl}/users`);
                console.log('Users response:', usersResponse);
                if (usersResponse.error) {
                    throw new Error(usersResponse.error);
                }

                // Finally, filter potential chats based on loaded user chats
                const filteredChats = usersResponse.filter((u: {name: string; _id: string; }) => {
                    if (user && user._id === u._id) {
                        console.log(`Excluding current user from potential chats: ${u.name}`);
                        return false;
                    }

                    // Check if a chat with the user already exists
                    const isChatCreated = userChats?.some(chat => {
                        const chatExists = chat.members.includes(u._id);
                        if (chatExists) console.log(`Chat already exists with user: ${u.name}`);
                        return chatExists;
                    });
                    return !isChatCreated;
                });
                console.log('Filtered potential chats:', filteredChats);
                setPotentialChats(filteredChats);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        }

        fetchData();
    }, [user]);

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
            createChat
         }}>
            {children}
        </ChatContext.Provider>
    );
}