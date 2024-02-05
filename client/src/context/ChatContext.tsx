import { createContext, useState, ReactNode, useEffect } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";

interface ChatContextType {
    userChats: any; 
    isUserChatsLoading: boolean;
    userChatsError: any; 
}

export const ChatContext = createContext<ChatContextType | null>(null);

interface User {
    _id: string;
}

interface ChatContextProviderProps {
    children: ReactNode;
    user: User | null;
}

export const ChatContextProvider: React.FC<ChatContextProviderProps> = ({ children, user }) => {
    const [userChats, setUserChats] = useState<User | null>(null); 
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);

    useEffect(()=>{
        const getUserChats = async()=>{
            if(user?._id){

                setIsUserChatsLoading(true);
                setUserChatsError(null);

                const response = await getRequest(`${baseUrl}/chats/${user?._id}`);
                
                setIsUserChatsLoading(false);

                if (response.error){
                    return setUserChatsError(response);
                }

                setUserChats(response);
            }
        }
        getUserChats();
    }, [user]);

    return (
        <ChatContext.Provider value={{ 
            userChats,
            isUserChatsLoading,
            userChatsError,
         }}>
            {children}
        </ChatContext.Provider>
    );
}