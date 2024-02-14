import React, { useContext, useEffect, useState } from 'react';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';

interface User {
    _id: string;
    name: string;
}

interface UserSelectionModalProps {
    isOpen: boolean | undefined;
    onClose: (() => Promise<void>) | undefined;
    onUserSelect: ((newUserId: string) => Promise<void>) | undefined;
    users: User[];
}

const UserSelectionModal: React.FC<UserSelectionModalProps> = ({ isOpen, onClose, onUserSelect, users}) => {

    if (!isOpen) return null;

    const [filteredUsers, setFilteredUsers] = useState<User[] | null>(null)
    const { currentChat } = useContext(ChatContext) ?? {};
    const {user} = useContext(AuthContext);

    useEffect(() => {
        if (!users || !currentChat) return;

        const alreadyInChatsUserIds: String[] = [];

        currentChat.members.forEach((member) => {
            alreadyInChatsUserIds.push(member);
        });

        console.log("alreadyInChatsUserIds", alreadyInChatsUserIds);

        const filtered = users.filter((u) => {
            return u._id !== user?._id && !alreadyInChatsUserIds.includes(u._id);
        });
        console.log("filtered", filtered);

        setFilteredUsers(filtered);
    }, [users, currentChat]);

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', width: '300px', maxHeight: '80%', overflowY: 'auto' }}>
                <h2>Select a User</h2>
                <button   onClick={() => {
                        if (onClose) {
                        onClose();
                        }
                    }} style={{ position: 'absolute', top: '10px', right: '10px' }} className='btn btn-danger'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                    </svg>
                </button>
                <ul>
                    {filteredUsers && filteredUsers.map(user => (
                        <li key={user._id} style={{ margin: '10px 0' }}>
                            <button onClick={() => {
                                if (typeof onUserSelect === 'function') {
                                    onUserSelect(user._id);
                                } else {
                                    console.error('onUserSelect is not a function');
                                }
                            }} style={{ marginRight: '10px' }} className='btn btn-outline-success'>{user.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default UserSelectionModal;