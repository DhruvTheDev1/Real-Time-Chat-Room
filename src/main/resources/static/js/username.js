document.getElementById("usernameForm").addEventListener("submit", function(event) {
    event.preventDefault();  // Prevent form from submitting and reloading the page

    const username = document.getElementById("usernameInput").value.trim();
    
    if (username) {
        // Save the username in localStorage
        localStorage.setItem("username", username);
        
        // Redirect to chatroom page
        window.location.href = "chatroom.html"; 
    } else {
        alert("Please enter a valid username.");
    }
});
