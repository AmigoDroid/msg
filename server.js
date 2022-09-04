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
const db =[];


io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    console.log('Grupo: '+data);
    console.log(db);
    let grupo={}
    if(db.length<=0){
      console.log('nem um item no banco de dados');
      grupo ={data:[]}
      db.push(grupo);
      socket.join(data);

    }else if(db.length >0){
      for(let i =0;i<db.length;i++){
        if(data == db[i]){
          socket.join(data);
          //atualizar
          console.log('Grupo localizado');
        }else if(i >= db.length){
          console.log('grupo não registrado');
          grupo ={data:[]}
          db.push(grupo);
          socket.join(data)

        }
      }
    }


   console.log(`User with ID: ${socket.id} no Grupo: ${data}`);
});

  socket.on("send_message", (data) => {
    const {room,author,message,time} = data;
    let grupo = {};
    // grupo={ room:{author:author,message:message,time:time,sockeId:socket.id}};
    // db.push(grupo);
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
