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

  // add message
  socket.on("sendMessage", (message)=>{
    const user = onlineUsers.find((onlineUser: OnlineUser) => onlineUser.userId === message.recipientId);
    if (user){
      io.to(user.socketId).emit("getMessage", message);
    }
  });

  socket.on("disconnect", ()=>{
    onlineUsers = onlineUsers.filter(OnlineUser => OnlineUser.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });
});

io.listen(3051);