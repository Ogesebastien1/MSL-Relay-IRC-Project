import { createContext, useState, ReactNode, useEffect } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";

interface Chat {
    name: string;
    chat: string;
}

interface ChatContextType {
    user:User | null;
    userChats: any; 
    isUserChatsLoading: boolean;
    userChatsError: any; 
    potentialChats: Array<Chat>;
}

export const ChatContext = createContext<ChatContextType | null>(null);

interface User {
    some(arg0: (chat: { members: any[]; }) => boolean): boolean;
    _id: string;
    name: string;
}

interface ChatContextProviderProps {
    children: ReactNode;
    user: User | null;
}

export const ChatContextProvider: React.FC<ChatContextProviderProps> = ({ children, user }) => {
    const [userChats, setUserChats] = useState<User | null>(null); 
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);
    const [potentialChats, setPotentialChats] = useState([]);

    useEffect(()=>{
        const getUsers = async ()=> {
            const response = await getRequest(`${baseUrl}/users`);
            if (response.error){
                return console.log("Error fetching users", response);
            }

            const pChats = response.filter((u: any) => {

                let isChatCreated = false;

                if(user && user._id === u._id) return false;

                if(userChats){
                    isChatCreated = userChats?.some((chat: { members: User[]; })=>{
                        return chat.members[0] === u._id || chat.members[1] === u._id;
                    });
                    
                    return !isChatCreated;
                }
            });
            setPotentialChats(pChats)
        };
        getUsers();
    }, [user]);

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
            potentialChats,
            user,
         }}>
            {children}
        </ChatContext.Provider>
    );
}