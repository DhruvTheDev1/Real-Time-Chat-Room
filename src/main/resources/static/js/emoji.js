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

            document.body.appendChild(picker);
        }
    });
});
