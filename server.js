const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const { join } = require("path");
app.use(cors());

const server = http.createServer(app);
const port = process.env.PORT || 8080;
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.get('/',(req,res)=>{
  res.send('hello word!');
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
   console.log(`User ID: ${socket.id} no Grupo: ${data}`);

  });

  socket.on("send_message", (data) => {
    const {room,author,message,time} = data;
    socket.to(room).emit("receive_message", data);
    
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(port, () => {
  console.log("SERVER RUNNING");
});
