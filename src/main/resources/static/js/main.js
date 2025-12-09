let stompClient = null;
let typingTimeout;
const username = localStorage.getItem("username");  // Gets username from localStorage
console.log("Username retrieved from localStorage:", username); // debbuging line

// Connects to websocket
function connect() {
    const socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);
    stompClient.connect({ "username": username }, function (frame) {
        console.log('Connected: ' + frame);

         // subscribes to user count right away when connected
        stompClient.subscribe('/topic/userCount', function (userCountOutput) {
            const userCount = parseInt(userCountOutput.body, 10);
            updateUserCount(userCount);  // Update user count
        });

        // Receive messages
        stompClient.subscribe('/topic/public', function (messageOutput) {
            showMessage(JSON.parse(messageOutput.body));  // Show messages
        });

        // Typing event subscription
        stompClient.subscribe('/topic/typing', function (typingOutput) {
            const typingMessage = JSON.parse(typingOutput.body);
            showTypingIndicator(typingMessage);  // Show typing indicator
        });

        // forces the bacend to send current user count as soon as a user connects
        setTimeout(() => {
            stompClient.send("/app/requestUserCount", {}, JSON.stringify({}));
        }, 1000); // delay to ensure websocket is ready before requesting user count

    });
}

// Send message to the server
function sendMessage() {
    const messageContent = document.getElementById('message').value.trim();
    if (messageContent && stompClient) {
        const chatMessage = {
            user: username,
            message: messageContent,
            messageType: 'CHAT',
        };

        stompClient.send("/app/chat", {}, JSON.stringify(chatMessage));
        document.getElementById('message').value = '';
    }
}

// Show message in chatbox
function showMessage(message) {

    const messageBox = document.getElementById('chat-messages');
    const newMessage = document.createElement('div');

    if (message.messageType === 'JOIN') {
        newMessage.textContent = `${message.user} has joined the chat.`;
    } else if (message.messageType === 'LEAVE') {
        newMessage.textContent = `${message.user} has left the chat.`;
    } else {
        const timestamp = new Date().toLocaleTimeString();
        newMessage.innerHTML = `<strong>${message.user}</strong>: ${message.message}
        <span class="timestamp">${timestamp}</span>`;
    }

    messageBox.appendChild(newMessage);
    messageBox.scrollTop = messageBox.scrollHeight;
}

// Updates user count
function updateUserCount(userCount) {
    console.log("User count received:", userCount);  // Debugging line
    const userCountElement = document.getElementById('active-users');
    userCountElement.textContent = userCount;
}

// show message being typed
function showTypingIndicator(typingMessage) {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingMessage.user !== username) {
        typingIndicator.textContent = `Someone is typing...`;
        typingIndicator.style.display = 'block';

        // hides typing indicator after 3 seconds
        setTimeout(() => {
            typingIndicator.style.display = 'none';
        }, 3000);
    }
}

// sends typing event
function sendTypingEvent() {
    const typingMessage = {
        user: username,
        message: '',
        messageType: 'TYPING'
    };
    stompClient.send("/app/chat.typing", {}, JSON.stringify(typingMessage));
}

document.getElementById("send").addEventListener("click", sendMessage);

document.getElementById("message").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        sendMessage();
        event.preventDefault();
    }
});

// sends typing event on any input
document.getElementById("message").addEventListener("input", function (event) {
    sendTypingEvent();

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(function () {
    }, 2000);
});

window.onload = connect;
