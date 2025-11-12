let stompClient = null;
const username = localStorage.getItem("username");  // Gets username from localStorage
console.log("Username retrieved from localStorage:", username); // debbuging line

// Connects to websocket
function connect() {
    const socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);
    stompClient.connect({"username": username}, function (frame) {  
        console.log('Connected: ' + frame);
        
        // Receive messages
        stompClient.subscribe('/topic/public', function (messageOutput) {
            showMessage(JSON.parse(messageOutput.body));  // Show messages
        });
        
        // User count
        stompClient.subscribe('/topic/userCount', function (userCountOutput) {
            const userCount = parseInt(userCountOutput.body, 10);
            updateUserCount(userCount);  // Updates active user count
        });
    });
}

// Send message to the server
function sendMessage() {
    const messageContent = document.getElementById('message').value.trim();
    if (messageContent && stompClient) {
        const chatMessage = {
            user: username,
            message: messageContent,
            messageType: 'CHAT' 
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
        newMessage.innerHTML = `<strong>${message.user}</strong>: ${message.message}`;
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

document.getElementById("send").addEventListener("click", sendMessage);

document.getElementById("message").addEventListener("keypress", function(event) {
    if (event.key === "Enter") { 
        sendMessage(); 
        event.preventDefault();
    }
});

window.onload = connect;
