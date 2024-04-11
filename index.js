const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);

//sets up each client that loads the HTML
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

//listens for each time a new client connects to the server via loading index.html
io.on("connection", (socket) => {
    console.log("a new user connected");
    //send out an event callled "connection"
  io.emit("connection", "a new user connected");

  //send a welcome msg
  socket.emit("welcome New User")


//send msg to all exceopt just conneted
  socket.broadcast.emit("New User", "Someone connected to  the chat")

  //listen to all "chat" 
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });



});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
