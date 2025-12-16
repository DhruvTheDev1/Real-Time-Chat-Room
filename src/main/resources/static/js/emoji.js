document.addEventListener("DOMContentLoaded", function() {
    const emojiButton = document.getElementById("emoji");
    const messageInput = document.getElementById("message");

    let picker = null;

    emojiButton.addEventListener("click", function() {
        if (picker) {
            picker.remove();
            picker = null; 
        } else {
            picker = new EmojiMart.Picker({
                onEmojiSelect: (emoji) => {
                    messageInput.value += emoji.native;
                },
            });

            
             
            const buttonRect = emojiButton.getBoundingClientRect();

            picker.style.position = "absolute";
            picker.style.top = buttonRect.bottom + window.scrollY + "px";  
            picker.style.left = buttonRect.right + window.scrollX - 200 + "px";

            document.body.appendChild(picker);
        }
    });
});
