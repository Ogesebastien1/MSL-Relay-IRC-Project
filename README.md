# T-JSF-600-STG_10

# MSL Relay IRC Project

## Contributors
- Oge Sébastien
- Shams Massous
- Loïc Jacob

## Description
**IRC Project - Epitech School**

This project aims to develop an IRC (Internet Relay Chat) application for Epitech School. The application consists of three main components: the server, socket, and client.

### Server
The server component is responsible for handling the core functionality of the IRC application. It allows multiple simultaneous connections and implements channels with the following features:
- Users can join multiple channels simultaneously.
- Channels can be created, renamed, and deleted.
- User activity, such as joining or leaving a channel, is displayed.
- Users can participate in chat discussions within the channels they have joined.

### Socket
The socket component facilitates real-time communication between the server and the client. It ensures that channels and messages are persistently stored using the most suitable method, such as file or database storage.

### Client
The client component provides a user-friendly interface built using React.js. It enables users to interact with the IRC application seamlessly. Key functionalities include:
- Setting user nicknames on the server.
- Listing available channels on the server.
- Creating, deleting, joining, and quitting channels.
- Listing users currently in a channel.
- Sending private messages to other users.
- Broadcasting messages to all users in a channel.

## Technologies Used
- **Stack:** MERN (MongoDB, Express.js, React.js, Node.js)
- **Package Manager:** pnpm
- **Socket Implementation:** Socket.IO
