
const express = require('express')
const path  = require('path');


const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const PORT = process.env.PORT;

app.use(express.static(path.join(__dirname,'public')));
app.set('views',path.join(__dirname,"public"));
app.engine('html',require('ejs').renderFile);
app.set('view engine','html');

//rota padrão do server
app.use("/",(req , res)=>{
 res.render("index.html")
});

//armazaenar as mensagens
var datamsg =[];

//ferificar se tem alguém conectado
io.on('connection', socket =>{
console.log('conectado: id='+socket.id);
 socket.emit('msgall',datamsg);

//ouvindo se alguém mandou mensagem
socket.on('sendMsg', data => {
    datamsg.push(data);
   
    socket.broadcast.emit('recebermsg',data);
    console.log(data);
});

});

//ouvindo na porta 3000
server.listen(PORT||3000);