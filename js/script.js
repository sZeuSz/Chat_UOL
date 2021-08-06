const PARTICIPANTS_URL = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants"
const MESSAGES_URL = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages";
const STATUS_URL = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status";

function rendezirarChat(){

    const promise = axios.get(MESSAGES_URL);
    console.log(promise)
    promise.then(tratarSucesso);
}
function tratarSucesso(answer){
    //private_message
    const mensagens_atualizadas = answer.data;
    console.log(mensagens_atualizadas.length)
    console.log(mensagens_atualizadas[0]);
    console.log(mensagens_atualizadas[0].type);
    console.log(mensagens_atualizadas[0].text);

    const lista_de_mensagens = document.querySelector(".content");

    for(let i = 0; i < mensagens_atualizadas.length; i++){

        if(mensagens_atualizadas[i].type === "status"){
            console.log("eh status")
            lista_de_mensagens.innerHTML += `<div class="${mensagens_atualizadas[i].type}-message style-all-message">
                                            <p class="mensagem"><span class="timer">(${mensagens_atualizadas[i].time})</span> <strong>${mensagens_atualizadas[i].from}</strong> ${mensagens_atualizadas[i].text}</p>
                                         </div>`
        }
        else if(mensagens_atualizadas[0].type === "message"){
            console.log("eh mensagem")
            lista_de_mensagens.innerHTML += `<div class="${mensagens_atualizadas[i].type}-message style-all-message">
                                            <p class="mensagem"><span class="timer">(${mensagens_atualizadas[i].time})</span> <strong>${mensagens_atualizadas[i].from}</strong> para <strong>${mensagens_atualizadas[i].to}</strong>: ${mensagens_atualizadas[i].text}</p>
                                         </div>`
        }
    }
    lista.scrollIntoView(true);
}
// rendezirarChat();
let lista = document.querySelector("textarea")

// setInterval(function(){
//     lista.scrollIntoView(true);
// }, 10)


function entrar(){
    console.log("entroouu")
    const name_input = document.querySelector(".user-name");
    const promise = axios.post(PARTICIPANTS_URL, {name: name_input.value})
    console.log(promise);
    promise.then(entrouComSucesso);
    promise.catch(erroAoEntrar);

    console.log(name_input.value)
    console.log(typeof(name_input.value))

}

function entrouComSucesso(resposta){
    
    console.log("sucesso")
    document.querySelector(".visibility").classList.toggle("suma");
    document.querySelector(".header").classList.toggle("suma");
    document.querySelector(".fixed-send-message").classList.toggle("suma");
    rendezirarChat();
}
function erroAoEntrar(error){
    
    console.log("deu ruim", error);
}