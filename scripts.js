let messagesFromServer = [];
let userName;
let participantsNames = [];
let statusCheck = "Wrong User";
let userNameObject = { name: "" };
let messageObject = {
    from: "",
    to: "",
    text: "",
    type: "",
};

function getMessagesFromTheServer() {
    checkStatus();
    if (userName === statusCheck) {
        const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
        promise.then(getData);
        promise.catch(informUser);
        statusCheck = "Wrong User";
    }
}

function getData(response) {

    messagesFromServer = response.data;
    document.querySelector("ul").innerHTML = "";
    startChat();
    showLastMessage();
}

function informUser(error) {
    alert(error.status + error.statusText + " Por favor, tente novamente mais tarde.");
}

function startChat() {
    messagesFromServer.forEach(printText);
}

function printText(message) {
    const messageBox = document.querySelector('ul');
    if (message.type === "private_message" && message.from === userName) {
        messageBox.innerHTML += `
        <li class="private_message" data-test="message">
            <span>(${message.time})</span>
            <span>${message.from}</span>reservadamente para
            <span>${message.to}:</span>${message.text}
        </li>`;

    } else if (message.type === "status") {
        messageBox.innerHTML += `
        <li class="status" data-test="message">
            <span>(${message.time})</span>
            <span> ${message.from}</span>${message.text}
        </li>`;
    } else if (message.type === "message") {
        messageBox.innerHTML += `
        <li data-test="message">
            <span>(${message.time})</span>
            <span>${message.from}</span>para
            <span>${message.to}:</span>${message.text}
        </li>`;
    }
}

let element = "";
function showLastMessage() {
    element = document.querySelector("li:last-of-type");
    element.scrollIntoView();
}

function createUsername() {
    userName = prompt("Qual é o teu lindo nome, snowflakes?");
    userNameObject = { name: userName };
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', userNameObject);
    promise.then(loggedIn);
    promise.catch(logInProblem);
}

function loggedIn() {
    getMessagesFromTheServer();
}

function logInProblem(error) {
    const badStatus = 400;
    if (error.response.status === badStatus) {
        alert("Este nome já existe. Seja mais criativo, por favor.");
        createUsername();
    }
}

function keepconnected() {
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', userNameObject);
    promise.then();
    promise.catch(statusProblem);
}

function statusProblem() {
    alert("Perdeste conexão com o servidor");
    window.location.reload();
}

function sendMessages() {

    const message = document.querySelector("input").value;

    if (message !== "") {
        messageObject = {
            from: userName,
            to: "Todos",
            text: message,
            type: "message"
        };
        const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', messageObject);
        promise.then(receivedMessage);
        promise.catch(messageNotReceived);
        document.querySelector("input").value = "";
    }
}

function receivedMessage() {
    getMessagesFromTheServer();
}

function messageNotReceived() {
    alert("Por favor, tente conectar novamente");
    window.location.reload();
}

function checkStatus() {
    const promisse = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    promisse.then(statusOnTheServer);
    promisse.catch(statusProblem);
}

function statusOnTheServer(response) {
    participantsNames = response.data;
    const nameFound = participantsNames.find(checkForUserName);
    statusCheck = nameFound.name;
}

function checkForUserName(nameFound) {
    if (nameFound.name === userName) {
        return true;
    }
    return false;
}

createUsername();
const checkNewMessageCycle = 3000;
setInterval(getMessagesFromTheServer, checkNewMessageCycle);
const sendStatusCycle = 5000;
setInterval(keepconnected, sendStatusCycle);