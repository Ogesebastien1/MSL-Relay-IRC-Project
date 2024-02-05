interface UserChatProps {
    chat: any; // replace Chat with the actual type you've defined for a chat
    user: any; // replace User with the actual type you've defined for a user
}

const UserChat: React.FC<UserChatProps> = ({ chat, user }) => {
    return (<>UserChat {chat}, {user}</>);
}

export default UserChat;