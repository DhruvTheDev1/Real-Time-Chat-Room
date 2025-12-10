document.getElementById("usernameForm").addEventListener("submit", function(event) {
    event.preventDefault(); 

    const username = document.getElementById("usernameInput").value.trim();
    
    if (username) {
        // checks if username is available
        fetch(`/check-username?username=${username}`)
            .then(response => response.json())
            .then(isTaken => {
                if (isTaken) {
                    // if username is taken
                    alert("Username '" + username + "' is already taken.");
                } else {
                    // saves the username in localStorage and proceed
                    localStorage.setItem("username", username);
                    window.location.href = "chatroom.html"; 
                }
            })
            .catch(error => {
                console.error('Error checking username:', error);
                alert("There was an error checking the username.");
            });
    } else {
        alert("Please enter a valid username.");
    }
});
