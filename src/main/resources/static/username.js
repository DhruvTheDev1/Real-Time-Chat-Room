document.getElementById("usernameForm").addEventListener("submit", function(event) {
    event.preventDefault(); 

    const username = document.getElementById("usernameInput").value.trim();
    if (username) {
        localStorage.setItem("username", username);
        window.location.href = "chatroom.html";  
    } else {
        alert("Please enter a username.");
    }
});
