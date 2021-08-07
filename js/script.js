const PARTICIPANTS_URL = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants"
const MESSAGES_URL = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages";
const STATUS_URL = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status";

const box_message = document.querySelector("textarea");
let name_input;
function rendezirarChat(){

    const promise = axios.get(MESSAGES_URL);
    // console.log(promise)
    promise.then(tratarSucesso);
}
function tratarSucesso(answer){
    //private_message
    console.log("sucesso")
    const mensagens_atualizadas = answer.data;
    // console.log(mensagens_atualizadas.length)
    // console.log(mensagens_atualizadas[0]);
    // console.log(mensagens_atualizadas[0].type);
    // console.log(mensagens_atualizadas[0].text);

    const lista_de_mensagens = document.querySelector(".content");

    lista_de_mensagens.innerHTML = "";
    
    for(let i = 0; i < mensagens_atualizadas.length; i++){

        if(mensagens_atualizadas[i].type === "status"){
            // console.log("eh status")
            lista_de_mensagens.innerHTML += `<div class="${mensagens_atualizadas[i].type}-message style-all-message">
                                            <p class="mensagem"><span class="timer">(${mensagens_atualizadas[i].time})</span> <strong>${mensagens_atualizadas[i].from}</strong> ${mensagens_atualizadas[i].text}</p>
                                         </div>`
        }
        else if(mensagens_atualizadas[i].type === "message"){
            // console.log("eh mensagem")
            lista_de_mensagens.innerHTML += `<div class="${mensagens_atualizadas[i].type}-message style-all-message">
                                            <p class="mensagem"><span class="timer">(${mensagens_atualizadas[i].time})</span> <strong>${mensagens_atualizadas[i].from}</strong> para <strong>${mensagens_atualizadas[i].to}</strong>: ${mensagens_atualizadas[i].text}</p>
                                         </div>`
        }
    }
    box_message.scrollIntoView(true);
}
rendezirarChat();



function entrar(){
    // console.log("entroouu")
    name_input = document.querySelector(".user-name").value;
    const promise = axios.post(PARTICIPANTS_URL, {name: name_input})
    promise.then(entrouComSucesso);
    promise.catch(erroAoEntrar);

}

function entrouComSucesso(resposta){
    console.log("sucesso")
    document.querySelector(".visibility").classList.toggle("suma");
    document.querySelector(".header").classList.toggle("suma");
    document.querySelector(".fixed-send-message").classList.toggle("suma");

    rendezirarChat();

    setInterval(function(){
        rendezirarChat();
    }, 3500)

    setInterval(function(){
        manterOnline();
    }, 5000)
}
function erroAoEntrar(error){
    console.log(error.response.status)
    if(error.response.status === 400){
        alert("Nome de usuário já existe")
    }
    console.log("deu ruim", error);
}


function manterOnline(){
    const promise = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status",{name:name_input})

    promise.then(manteveComSucesso);
    promise.catch(manteveComNaoSucesso);
}

function manteveComSucesso(){
    console.log("mais 4 segundos");
}
function manteveComNaoSucesso(error){
    console.log(error);
}


function enviarMensagem(){
    
    let message = document.querySelector("textarea").value;

    const promise = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages", {
        from: name_input,
        to: "Todos",
        text: message,
        type: "message"
    });

    console.log(box_message.value);

    box_message.value = "";
    
    promise.then(enviouComSucesso);
    promise.catch(erroAoEnviar);
}

function enviouComSucesso(){
    console.log("mensagem, enviada");
    rendezirarChat();
}
function erroAoEnviar(erro){
    console.log(erro.response.status);
    console.log("erro ao enviar essa mensagem, desconectado");
    // setTimeout(() => {
    //     window.location.reload()
    // }, 2000);
}


/* Side bar functions*/

function choicePeople(elemento){
    console.log("Escolhi um caba");
    console.log(elemento)
}

function choiceVisibily(elemento){
    console.log("Escolhi um status");   
    
    let selecionado = document.querySelector(".linha.selecionada") 

    console.log(selecionado )
    
    if(selecionado !== null){
        selecionado = document.querySelector(".linha.selecionada .check").classList.remove("desaparecido");
            document.querySelector(".linha.selecionada").classList.remove("selecionada");
    }
    elemento.classList.add("selecionada");
    selecionado = document.querySelector(".linha.selecionada .check").classList.add("desaparecido") 
    
}   