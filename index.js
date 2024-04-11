const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
  });
  
  const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('set nickname', (nickname) => {
    socket.nickname = nickname;
    onlineUsers.set(socket.id, nickname);
    io.emit('update online users', [...onlineUsers.values()]);
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', `${socket.nickname}: ${msg}`);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    // Remove user from online users set
    onlineUsers.delete(socket.id);
    // SEND updated online users to all clients
    io.emit('update online users', [...onlineUsers]);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
