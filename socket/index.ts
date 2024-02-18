import { Server } from "socket.io";

interface OnlineUser {
  userId: string;
  socketId: string;
}

const io = new Server({
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"]
    }
});

let onlineUsers: OnlineUser[] = [];

io.on("connection", (socket) => {
  console.log("new connection:", socket.id);

  // listen to a custom connection
  socket.on("addUser", (userId: string)=>{

    // if the condition is true, user will be push to array. Otherwise (false), the user is already in the array
    !onlineUsers.some((OnlineUser: OnlineUser) => OnlineUser.userId === userId) &&
      onlineUsers.push({
        userId,
        socketId: socket.id
    });
    console.log("onlineUsers:", onlineUsers);
    io.emit("getOnlineUsers", onlineUsers);
  });

  // send message
  socket.on("sendMessage", (message) => {
    if (message.isChannel) {
      message.members.forEach((memberId: string) => {
        const memberUser = onlineUsers.find((onlineUser: OnlineUser) => onlineUser.userId === memberId && onlineUser.userId !== message.senderId);
        if (memberUser) {
          io.to(memberUser.socketId).emit("getMessage", message);
        }
      });
    } else {
      const user = onlineUsers.find((onlineUser: OnlineUser) => onlineUser.userId === message.recipientId);
      if (user) {
        io.to(user.socketId).emit("getMessage", message);
      }
    }
  });

  // emitting a notification message when a user joins a chat
  socket.on("joinChat", ({ joinedChatName, userId, userName, members }) => {
    members.forEach((memberId: string) => {
      let onlineMemberUser = onlineUsers.find((onlineUser: OnlineUser) => onlineUser.userId === memberId && onlineUser.userId !== userId);
      if (onlineMemberUser) {
        io.to(onlineMemberUser.socketId).emit('notification', {
          type: 'notification',
          text: `${userName} has joined ${joinedChatName}`
        });
      }
    });
  });

  // emitting a notification message when a user quit a chat
  socket.on("quitChat", ({ quitChatName, userId, userName, members }) => {
    console.log("triggered", quitChatName, userId, userName, members)
    members.forEach((memberId: string) => {
      let onlineMemberUser = onlineUsers.find((onlineUser: OnlineUser) => onlineUser.userId === memberId && onlineUser.userId !== userId);
      if (onlineMemberUser) {
        io.to(onlineMemberUser.socketId).emit('notification', {
          type: 'notification',
          text: `${userName} has quitted ${quitChatName}`
        });
      }
    });
  });

  socket.on("disconnect", ()=>{
    onlineUsers = onlineUsers.filter(OnlineUser => OnlineUser.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });
});

io.listen(3051);