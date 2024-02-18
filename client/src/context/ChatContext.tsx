import { createContext, useState, useEffect, useCallback, useContext } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";
import { io, Socket } from "socket.io-client";
//import { inputHandler } from "../utils/inputMessage";
import { ChatContextType, ChatContextProviderProps, Chat, Message, User, OnlineUser, ErrorState } from '../types/ChatContextTypes';
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext<ChatContextType | null>(null);
    

export const ChatContextProvider: React.FC<ChatContextProviderProps> = ({ children, user }) => {
    const [userChats, setUserChats] = useState<Chat[] | null>(null);
    const [isUserChatsLoading, setIsUserChatsLoading] = useState<boolean>(false);
    const [userChatsError, setUserChatsError] = useState<ErrorState | null>(null);
    const [potentialChats, setPotentialChats] = useState<Array<User>>([]);
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
        const members: string[] = currentChat?.members ?? [];
        let isChannel = false;
        if(currentChat?.chatName){
            isChannel = true;
        }
        socket.emit("sendMessage", {...newMessage, recipientId, members, isChannel})
    }, [newMessage]);

    // recieve real-time message
    useEffect(()=>{
        if (socket === null) return
        
        socket.on("getMessage", res => {
            if (currentChat?._id !== res.chatId) return 
            
            setMessages((prev) => prev ? [...prev, res] : [res]);
        });

        let toConsole;
        socket.on("notification", (notif) => {
            setMessages((prevMessages) => [...(prevMessages || []), notif]);
            toConsole = notif;
        });

        return  () => {
            socket.off("getMessage");
            socket.off("notification");
        }

    }, [socket, currentChat]);

    // potential chats
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

    // to get all messages of current chat/channel
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

    // to send message
    const sendTextMessage = useCallback(async (textMessage: string, sender: User, currentChatId: string, setTextMessage: React.Dispatch<React.SetStateAction<string>>) => {

        if (!textMessage) console.log("you must type something...");

        const response = await postRequest(`${baseUrl}/messages`, JSON.stringify({
            chatId: currentChatId,
            senderId: sender._id,
            text: textMessage,
            senderName: sender.name,
        }));

        if (response.error) {
            return setSendTextMessageError(response);
        };

        setNewMessage(response);
        setMessages((prev) => prev ? [...prev, response] : [response]);
        setTextMessage("");
    }, [])

    // to update the current chat
    const updateCurrentChat = useCallback(((chat: Chat)=>{
        setCurrentChat(chat);
    }), []);

    // creating a chat/channel
    const createChat = useCallback(async (firstId: string, secondId?: string, chatName?: string) => {
        // Construct an object that includes user/users
        let chatData = {}
        secondId ? chatData = {firstId: firstId, secondId: secondId} : chatData = {firstId: firstId, chatName: chatName};
        
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
    // delete chat/channel
    const deleteChat = useCallback(async (chatName: string)=>{

        const data = JSON.stringify({ chatName });
        const response = await postRequest(`${baseUrl}/chats/delete`, data);

        if (response.error) {
            return console.log("Error deleting chat", response);
        }

        // Filter out the deleted chat from the userChats state
        setUserChats((prev) => {
            // If prev is null, just return null
            if (prev === null) return null;
    
            // Filter out the deleted chat and return the new array
            const updatedChats = prev.filter(chat => chat.chatName !== chatName);
    
            // Return the updated chats array, which will always be an array, thus matching Chat[] | null
            return updatedChats.length > 0 ? updatedChats : null;
        });
    },[])

     // join channel
     const joinChat = useCallback(async (chatName: string, ) => {
        
        const userId = user?._id;  
        try {
            const data = JSON.stringify({ chatName, userId});
            const response = await postRequest(`${baseUrl}/chats/join`, data); // Adjust the URL accordingly

            if (response.error) {
                // Show error message to the user in a prompt
                alert("Already in chat");
                return console.log("Already in chat");
            }

            // notification to other users
            const joinedChatName = response.chatName;
            const userName = user?.name;
            const members: string[] = response?.members ?? [];
            if (socket) socket.emit("joinChat", { joinedChatName, userId, userName, members });

             // Update the userChats state
            setUserChats((prev) => {
                return prev ? [...prev, response] : [response];
            })
    
        } catch (error) {
            console.error("Error joining chat", error);
        }

    

    }, [user, socket]);

     // quit channel
    const quitChat = useCallback(async (chatName: string) => {

        const userId = user?._id;  
        try {
            const data = JSON.stringify({ chatName, userId});
            const response = await postRequest(`${baseUrl}/chats/quit`, data);
    
            if (response.error) {
                return console.log("Error quitting chat", response);
            }

            // notification to other users
            const quitChatName = response.chatName;
            const userName = user?.name;
            const members: string[] = response?.members ?? [];
            if (socket) socket.emit("quitChat", { quitChatName, userId, userName, members });
            
        } catch (error) {
            console.error("Error quitting chat", error);
        }

        // Filter out the deleted chat from the userChats state
        setUserChats((prev) => {
            // If prev is null, just return null
            if (prev === null) return null;
    
            // Filter out the deleted chat and return the new array
            const updatedChats = prev.filter(chat => chat.chatName !== chatName);
    
            // Return the updated chats array, which will always be an array, thus matching Chat[] | null
            return updatedChats.length > 0 ? updatedChats : null;
        });
    }, [user, socket]);

    // toggle modal visibility
    const handleToggleAddUserModal = useCallback(async () => {
        setShowAddUserModal(!showAddUserModal);
    }, [showAddUserModal]);

    // add user in chat/channel
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

                setCurrentChat((prevChat) => {
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
            showAddUserModal,
            deleteChat,
            joinChat,
            quitChat
         }}>
            {children}
        </ChatContext.Provider>
    );
}