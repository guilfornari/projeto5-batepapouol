let messagesChat = [];
let userNameObject = { name: "" };

function getMessagesFromTheServer() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(getData);
}

function getData(response) {
    messagesChat = response.data;
    startChat();
    console.log(messagesChat);
    showLastMessage();
}

function startChat() {
    messagesChat.forEach(printText);
}

function printText(message) {
    let messageBox = document.querySelector('ul');
    if (message.type === "private_message") {
        messageBox.innerHTML += `
        <li class="private_message">
            <span>(${message.time})</span>
            <span>${message.from}</span>reservadamente para
            <span>${message.to}:</span>${message.text}
        </li>`;

    } else if (message.type === "status") {
        messageBox.innerHTML += `
        <li class="status">
            <span>(${message.time})</span>
            <span> ${message.from}</span>${message.text}
        </li>`;
    } else {
        messageBox.innerHTML += `
        <li>
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
    let userName = prompt("Qual é o teu lindo nome, snowflakes?")
    userNameObject = { name: userName };
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', userNameObject);
    promise.then(logIn);
    promise.catch(logInProblem);
}

function logIn(response) {
    console.log(response);
}

function logInProblem(error) {
    console.log(error)
    if (error.response.status === 400) {
        createUsername();
    }
}

createUsername();
getMessagesFromTheServer();
//setInterval(getMessagesFromTheServer, 3000);








