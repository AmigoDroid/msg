
var soket = io('http://localhost:3000');

$('#chat').submit(function(event){

    event.preventDefault();
    var name_usuario =document.getElementById('user').value;
    var name_mensagem =document.getElementById('txt').value;
    console.log(name_mensagem);

    if(name_usuario.length >= 0 && name_mensagem.length>=0){
        var msgObj = {
            altor:name_usuario,
            mensagem:name_mensagem
        }
        //enviar mensagem
        soket.emit('sendMsg',msgObj);
       
    }
    

})
