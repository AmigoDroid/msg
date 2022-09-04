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
    console.log('Grupo: '+data);

    if(db.find(grupoId => grupoId[''+data] == data)){
      console.log('grupo existe');
      socket.join(data);
      socket.to(data).emit('update',db.find(grupoId => grupoId[''+data]))
      console.log('data: '+db);
    }else{
      grupo[""+data] =[];
      db.push(grupo);
      console.log('grupo não existe');
      socket.join(data);
      console.log('data: '+db);
    }
  
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    const {room,author,message,time} = data;
    grupo[""+room].push({author:author,message:message,time:time,sockeId:socket.id});
    socket.to(data.room).emit("receive_message", data);
    console.log('data: '+db);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(port, () => {
  console.log("SERVER RUNNING");
});
