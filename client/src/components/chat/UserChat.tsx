interface UserChatProps {
    chat: string; 
    user: any; 
}

const UserChat: React.FC<UserChatProps> = ({ chat, user }) => {
    return (<>UserChat {chat}, {user}</>);
}

export default UserChat;