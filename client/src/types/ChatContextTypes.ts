import { ReactNode } from "react";

export interface Chat {
    chatName: string;
    _id: string;
    members: string[];
}

export interface Message {
    [x: string]: any; // needed for map() in ChatBox.tsx
    _id: string;
    senderId: string;
    text: string;
    creatAt: Date;
    senderName: string;
}

export interface User {
    _id: string;
    name: string;
}

export interface OnlineUser {
    userId: string;
    socketId: string;
}

export interface ErrorState {
    message: string;
}

export interface ChatContextType {
    user:User | null;
    userChats: Chat[] | null; 
    isUserChatsLoading: boolean;
    userChatsError: ErrorState | null; 
    potentialChats: Array<User>;
    createChat: (firstId: string, secondId?: string, chatName?: string) => Promise<void>;
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
    deleteChat: (chatName: string) => Promise<void>;
}

export interface ChatContextProviderProps {
    children: ReactNode;
    user: User | null;
}