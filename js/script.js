const PARTICIPANTS_URL = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol[/participants](https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants)";
const MESSAGES_URL = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages";
const STATUS_URL = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status";

function rendezirarChat(){

    const promise = axios.get(MESSAGES_URL);
    console.log(promise)
    promise.then(tratarSucesso);
}
function tratarSucesso(answer){
    
    const mensagens_atualizadas = answer.data;
    console.log(mensagens_atualizadas.length)
    console.log(mensagens_atualizadas);
}
rendezirarChat();