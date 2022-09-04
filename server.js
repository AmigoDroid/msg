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


io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    console.log('Grupo: '+data);
    console.log(db);
    for(let i =0; i< db.length ;i++){
      console.log(db[i]);
      if(db[i] == data){
        console.log(db[i]);
        socket.join(db[i]);

        console.log('grupo localizado');
        console.log(db);

      }else if( i== db.length){

        console.log("não encontrado o grupo no banco de dados");
        let grupo ={};
        grupo[data] = [];
        socket.join(data);
      }
    }
  
    console.log(`User with ID: ${socket.id} no Grupo: ${data}`);
});

  socket.on("send_message", (data) => {
    const {room,author,message,time} = data;
    let grupo = {};
    grupo[""+room].push({author:author,message:message,time:time,sockeId:socket.id});
    socket.to(room).emit("receive_message", data);
    console.log('data: '+db);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(port, () => {
  console.log("SERVER RUNNING");
});
