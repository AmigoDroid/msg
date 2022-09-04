const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);
const port = process.env.PORT || 8080;
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const db =[]
let grupo = {}

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    const {room,author,message,time} = data;
    console.log('Grupo: '+room);
    if(db.find(grupoId => grupoId[''+room] == room)){
      console.log('grupo existe');
      socket.join(data.room);
      socket.to(room).emit('update',db.find(grupoId => grupoId[''+room]))
    }else{
      grupo[""+room] =[];
      db.push(grupo);
      console.log('grupo não existe');
      socket.join(data.room);
    }
  
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    const {room,author,message,time} = data;
    grupo[""+room].push({author:author,message:message,time:time,sockeId:socket.id});
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(port, () => {
  console.log("SERVER RUNNING");
});
