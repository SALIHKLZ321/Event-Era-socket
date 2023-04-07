const io = require("socket.io")(8000, {
    cors: {
      origin: "https://eventera.online",
    },
  });
  
  let activeUser = [];

io.on("connection", (socket) => {
  socket.on("new-user-add", (newUserId) => {
    if (!activeUser.some((user) => user.userId === newUserId)) {
      activeUser.push({
        userId: newUserId,
        socketId: socket.id,
      });
    }
    io.emit("get-user", activeUser);
  });
  socket.on("send-message", (data) => {
    console.log(data);
    const { receiverId } = data;
    console.log(receiverId , activeUser);
    const user = activeUser.find((user) => user.userId === receiverId);
    if (user) {
      io.to(user.socketId).emit("receive-message", data.data);
    }
  });
  socket.on("disconnect", () => {
    activeUser = activeUser.filter((user) => user.socketId !== socket.id);
    io.emit("get-users", activeUser);
  });
});

