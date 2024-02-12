import React, { useState } from 'react';
import { Button } from 'react-bootstrap'; 

interface Channel {
    id: number;
    name: string;
    invitedUsers: string[]; 
}

interface Props {
    onCreateNewChannel: () => void;
    onChannelClick: (channel: Channel) => void; 
}

const Channel: React.FC<Props> = ({ onCreateNewChannel, onChannelClick }) => {
    const [channels, setChannels] = useState<Channel[]>([]); // List of channels

    const handleCreateNewChannel = () => {
        // Prompt user for channel name
        const channelName = prompt('Enter channel name:');
        if (!channelName) return; // If user cancels prompt, return
        
        // Prompt user for invited users
        const invitedUsersString = prompt('Enter invited users separated by commas (optional):');
        const invitedUsers = invitedUsersString ? invitedUsersString.split(',').map(user => user.trim()) : [];

        // Generate a random ID for the new channel (replace with your actual logic)
        const newChannelId = Math.floor(Math.random() * 1000) + 1;

        // Create a new channel object
        const channel: Channel = {
            id: newChannelId,
            name: channelName,
            invitedUsers: invitedUsers
        };

        setChannels(prevChannels => [...prevChannels, channel]);

        onCreateNewChannel();
    };

    const handleChannelClick = (channel: Channel) => {
        onChannelClick(channel);
    };

    return (
        <>
            <Button onClick={handleCreateNewChannel} style={{ position: 'absolute', top: 0, right: '40px', marginTop: '80px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                    <path d="M8 7V3h1v4h4v1H9v4H8V8H4V7h4z"/>
                </svg>
            </Button>
            <div style={{ position: 'absolute', top: 0, left: '10px', marginTop: '80px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridGap: '10px' }}>
                {channels.map(channel => (
                    <div key={channel.id} style={{ cursor: 'pointer', padding: '5px', backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRadius: '5px', fontSize: '0.9em', lineHeight: '1.2' }} onClick={() => handleChannelClick(channel)}>
                        <h5 style={{ marginBottom: '5px' }}>Channel:</h5>
                        <p style={{ margin: 0 }}>{channel.name}</p>
                    </div>
                ))}
            </div>
        </>
    );
}

export default Channel;
