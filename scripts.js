let messagesChat = [];

function getMessagesFromTheServer() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(getData);
}

function getData(response) {
    messagesChat = response.data;
    startChat();
    console.log(messagesChat);
}

function startChat() {
    messagesChat.forEach(printText);
}

function printText(message) {
    let messageBox = document.querySelector('ul');
    messageBox.innerHTML += `<li>(${message.time}) ${message.from} para ${message.to} ${message.text}</li>`;
}

getMessagesFromTheServer();





