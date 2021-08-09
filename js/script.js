const PARTICIPANTS_URL = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants"
const MESSAGES_URL = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages";
const STATUS_URL = "https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status";

let people = "";
let type_message = "";
let name_input;
let last_message;
let users_active = [];

function renderChat(){

    const promise = axios.get(MESSAGES_URL);

    promise.then(renderChatSucess);
}
function renderChatSucess(answer){
    const mensagens_atualizadas = answer.data;

    const lista_de_mensagens = document.querySelector(".content");
    
    lista_de_mensagens.innerHTML = "";
    
    for(let i = 0; i < mensagens_atualizadas.length; i++){

        if(mensagens_atualizadas[i].type === "status"){
            lista_de_mensagens.innerHTML += `<div class="${mensagens_atualizadas[i].type}-message style-all-message">
                                            <p class="mensagem"><span class="timer">(${mensagens_atualizadas[i].time})</span> <strong>${mensagens_atualizadas[i].from}</strong> ${mensagens_atualizadas[i].text}</p>
                                         </div>`
        }
        else if(mensagens_atualizadas[i].type === "message"){
            lista_de_mensagens.innerHTML += `<div class="${mensagens_atualizadas[i].type}-message style-all-message">
                                            <p class="mensagem"><span class="timer">(${mensagens_atualizadas[i].time})</span> <strong>${mensagens_atualizadas[i].from}</strong> para <strong>${mensagens_atualizadas[i].to}</strong>: ${mensagens_atualizadas[i].text}</p>
                                         </div>`
        }
        else if(mensagens_atualizadas[i].type === "private_message"){
            if(mensagens_atualizadas[i].from === name_input || mensagens_atualizadas[i].to === name_input){
                lista_de_mensagens.innerHTML += `<div class="${mensagens_atualizadas[i].type}-message style-all-message">
                                            <p class="mensagem"><span class="timer">(${mensagens_atualizadas[i].time})</span> <strong>${mensagens_atualizadas[i].from}</strong> reservadamente para <strong>${mensagens_atualizadas[i].to}</strong>: ${mensagens_atualizadas[i].text}</p>
                                         </div>`
            }
        }
    }    

    let box_message = document.querySelector(".style-all-message:nth-last-child(-n+1) p:nth-last-child(-n+1)").innerText;
    
    if(box_message !== last_message){
        last_message = box_message;
        box_message = document.querySelector(".style-all-message:nth-last-child(-n+1) p:nth-last-child(-n+1)");
        box_message.scrollIntoView(true);
    }
}


/*Start register user functions */

function registerUser(){
    name_input = document.querySelector(".user-name").value;

    if(!isValidName(name_input)){
        alert("Nome de usuário invalido")
        return;
    }

    document.querySelector(".button").classList.toggle("suma");
    document.querySelector(".user-name").classList.toggle("suma");
    document.querySelector(".loading").classList.toggle("suma");

    const promise = axios.post(PARTICIPANTS_URL, {name: name_input})

    promise.then(registerUserSucess);
    promise.catch(registerUserError);
}

function registerUserSucess(){
    document.querySelector(".form-user-name").classList.toggle("suma");
    document.querySelector(".fixed-send-message").classList.toggle("suma");
    document.querySelector(".visibility").classList.toggle("suma");
    document.querySelector(".header").classList.toggle("suma");

    renderChat();

    usersActive();

    setInterval(function(){
        renderChat();
    }, 3000)

    setInterval(function(){
        keepActiveStatus();
    }, 5000)

    setInterval(function(){
        usersActive();
    }, 10000)
}

function registerUserError(error){
    if(error.response.status === 400){
        const button = document.querySelector(".button").classList.toggle("suma");
        const input = document.querySelector(".user-name").classList.toggle("suma");
        const carregando = document.querySelector(".loading").classList.toggle("suma");
        alert("Nome de usuário já existe")
    }
}

function isValidName(name_input){
    let is = 0;
    let left = name_input.indexOf('<');
    let right = name_input.indexOf('>');

    if(name_input[0] === "<" && name_input[name_input.length - 1] === ">" && name_input[0] === "<" && name_input[1] !== " "){
        return is;
    }

    if(left !== -1 && right !== -1){
        for(let i = 0; i < left; i++){
            if(name_input[i] !== " "){
                is = 1;
            }
        }
        for(let i = right + 1; i < name_input.length; i++){
            if(name_input[i] !== " "){
                is = 1;
            }
        }

        if(!is && name_input[left + 1] === " "){
            for(let i = 0; i < name_input.length; i++){
                if(name_input[i] !== " "){
                    is = 1;
                }
            }
        }
    }
    else if(left !== -1 && right === -1){
        if(name_input[left + 1] === " "){
            for(let i = 0; i < name_input.length; i++){
                if(name_input[i] !== " "){
                    is = 1;
                }
            }
        }
    }
    else{
        for(let i = 0; i < name_input.length; i++){
            if(name_input[i] !== " "){
                is = 1;
            }
        }
    }

    return is;
}
/*Final register user functions */


/*Start Keep Active Status functions */
    
function keepActiveStatus(){
    const promise = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status",{name:name_input})

    promise.catch(keepActiveStatusError);
}

function keepActiveStatusError(error){
    if(error.response.status === 400){
        alert("Ops! problema no servidor, estamos resolvendo isso");
    }
}
/*Final Keep Active Status functions */


/*Start Send Menssage Functions */

function sendMessage(){
    
    let message = document.querySelector("textarea");

    if(!isValidMessage(message.value)){

        message.value = "";

        return;
    }

    let inforMessage;
    if(people === "Todos" && type_message === "Reservadamente"){
        for(let i = 0; i < users_active.length; i++){
            inforMessage = {
                from: name_input,
                to: users_active[i].name,
                text: message.value,
                type: "private_message"
            }

            const promise = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages", inforMessage);            
            promise.then(sendMessageSuccess);
            promise.catch(sendMessageError);
        }
        message.value = "";

        return;
    }
    else if(people !== "" && type_message === "Reservadamente"){
        inforMessage = {
            from: name_input,
            to: people,
            text: message.value,
            type: "private_message"
        }
    }
    else if(people !== "" && type_message === "Público"){
        inforMessage = {
            from: name_input,
            to: people,
            text: message.value,
            type: "message"
        }
    }
    else if(people !== "" && type_message === ""){
        inforMessage = {
            from: name_input,
            to: people,
            text: message.value,
            type: "message"
        }
    }
    else if(people === "" && type_message === "Reservadamente"){
        inforMessage = {
            from: name_input,
            to: "Todos",
            text: message.value,
            type: "private_message"  
        }
    }
    else{
        inforMessage = {
            from: name_input,
            to: "Todos",
            text: message.value,
            type: "message"     
        }
    }

    const promise = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages", inforMessage);

    message.value = "";
    
    promise.then(sendMessageSuccess);
    promise.catch(sendMessageError);
}

function sendMessageSuccess(){
    let message = document.querySelector("textarea");
    message.value = "";
    renderChat();
}
function sendMessageError(erro){
    alert("erro ao enviar essa mensagem, desconectado");
    window.location.reload()
}


function isValidMessage(message){
    let is = 0;
    let left = message.indexOf('<');
    let right = message.indexOf('>');
    
    if(message[0] === "<" && message[message.length - 1] === ">" && message[0] === "<" && message[1] !== " "){
        return is;
    }

    if(left !== -1 && right !== -1){
        for(let i = 0; i < left; i++){
            if(message[i] !== " "){
                is = 1;
            }
        }
        for(let i = right + 1; i < message.length; i++){
            if(message[i] !== " "){
                is = 1;
            }
        }

        if(!is && message[left + 1] === " "){
            for(let i = 0; i < message.length; i++){
                if(message[i] !== " "){
                    is = 1;
                }
            }
        }
    }
    else if(left !== -1 && right === -1){
        if(message[left + 1] === " "){
            for(let i = 0; i < message.length; i++){
                if(message[i] !== " "){
                    is = 1;
                }
            }
        }
    }
    else{
        if(message === "" || message === "\n"){
            return is;
        }
        
        for(let i = 0; i < message.length; i++){
            if(message[i] !== " " && message[i] !== "\n"){
                is = 1;
            }
            if(message[i] === "\n"){
                message[i] = " ";
            }
        }
    }

    return is;
}
/*Final Send Menssage Functions */


/* Start Side bar functions */

function openSideBar(){
    const darkness = document.querySelector(".darkness")
    const sideBar = document.querySelector(".side-bar")
    const visibility = document.querySelector(".visibility")

    darkness.classList.remove("suma");
    sideBar.classList.remove("suma");
    visibility.classList.remove("suma");
}

function choicePeople(elemento){
    let selecionado = document.querySelector(".peoples .linha.selecionada") 
    
    if(selecionado !== null){
        selecionado = document.querySelector(".peoples .linha.selecionada .check").classList.remove("desaparecido");
            document.querySelector(".peoples .linha.selecionada").classList.remove("selecionada");
    }
    elemento.classList.add("selecionada");
    selecionado = document.querySelector(".peoples .linha.selecionada .check").classList.add("desaparecido") 
    people = elemento.innerText;
}

function choiceVisibily(elemento){    
    let selecionado = document.querySelector(".visibility .linha.selecionada") 
    
    if(selecionado !== null){
        selecionado = document.querySelector(".visibility .linha.selecionada .check").classList.remove("desaparecido");
            document.querySelector(".visibility .linha.selecionada").classList.remove("selecionada");
    }

    elemento.classList.add("selecionada");

    selecionado = document.querySelector(".visibility .linha.selecionada .check").classList.add("desaparecido") 
    type_message = elemento.innerText;
}   

function closeSideBar(){
    const sideBar = document.querySelector(".side-bar");
    const header = document.querySelector(".header");
    const darkness = document.querySelector(".darkness")
    darkness.classList.add("suma");
    sideBar.classList.add("suma");
    
    
    showInforMessage(people, type_message);
}


function usersActive(){
    const promise = axios.get(PARTICIPANTS_URL);
    promise.then(usersActiveSucess);
    promise.catch(usersActiveError);
}

function usersActiveSucess(answer){
    users_active = answer.data;

    let listUsersActives = document.querySelector(".peoples");

    listUsersActives.innerHTML = `<li class="linha padrao" onclick="choicePeople(this)"><ion-icon name="people"></ion-icon>Todos <ion-icon class="check desaparecido" name="checkmark-outline"></ion-icon></li>`;

    for(let i = 0; i < answer.data.length; i++){

        if(answer.data[i].name === people){
            listUsersActives.innerHTML += `<li class="linha selecionada" onclick="choicePeople(this)"><ion-icon name="person-circle"></ion-icon>${answer.data[i].name} <ion-icon class="check desaparecido" name="checkmark-outline"></ion-icon></li>`
        }
        else{
            listUsersActives.innerHTML += `<li class="linha" onclick="choicePeople(this)"><ion-icon name="person-circle"></ion-icon>${answer.data[i].name} <ion-icon class="check desaparecido" name="checkmark-outline"></ion-icon></li>`
        }
    }
    
}

function usersActiveError(error){
    if(error.response.status === 400){
        alert("Ops! Ocorreu o um erro no servidor, estamos consertando isso.");
    }
}

/*Final side bar functions */

function showInforMessage(user, type_message){
    const infoVisibility = document.querySelector(".info-visibility");

    infoVisibility.classList.remove("suma");

    if(user !== "" && type_message !== ""){
        infoVisibility.innerText = `Enviando para ${user} (${type_message})`;
    }
    else if(user !== "" && type_message === ""){
        infoVisibility.innerText = `Enviando para ${user} (Público)`;
        type_message = "Público";
    }
    else if(user === "" && type_message !== ""){
        infoVisibility.innerText = `Enviando para Todos (${type_message})`;
    }
}

/*Permitindo entrar e enviar mensagem usando o Enter */

let texto = document.querySelector("textarea");
texto.addEventListener('keydown', function(e){
    if (e.keyCode == 13) {
        sendMessage();
    }
});

let input = document.querySelector("input");
input.addEventListener('keydown', function(e){
    if (e.keyCode == 13) {
        registerUser();
    }
});