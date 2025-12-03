package com.dhruvthedev1.realtime_chatapplication.configuration;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.dhruvthedev1.realtime_chatapplication.model.ChatMessage;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
@RequiredArgsConstructor
public class WebSocketEventListener {
    private final SimpMessageSendingOperations messagingTemplate;
    private Set<String> onlineUsers = Collections.synchronizedSet(new HashSet<>()); // Stores active users

    // When a user joins
    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());

        String username = (String) headerAccessor.getNativeHeader("username").get(0);

        if (username != null) {
            // Set username
            headerAccessor.getSessionAttributes().put("username", username);
            log.info("User connected: {}", username);

            onlineUsers.add(username);
            sendActiveUserList();

            // Send join message
            ChatMessage chatMessage = ChatMessage.builder()
                    .messageType(ChatMessage.MessageType.JOIN)
                    .user(username)
                    .build();
            messagingTemplate.convertAndSend("/topic/public", chatMessage);
        } else {
            log.error("No username found in connection headers.");
        }
    }

    // When a user disconnects
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = (String) headerAccessor.getSessionAttributes().get("username");

        if (username != null) {
            log.info("User disconnected: {}", username);

            onlineUsers.remove(username);
            sendActiveUserList();

            // Send disconnect message
            ChatMessage chatMessage = ChatMessage.builder()
                    .messageType(ChatMessage.MessageType.LEAVE)
                    .user(username)
                    .build();
            messagingTemplate.convertAndSend("/topic/public", chatMessage);
        } else {
            log.error("No username found in session during disconnect.");
        }
    }

    private void sendActiveUserList() {
        int userCount = onlineUsers.size();
        log.info("Current Users: {}", userCount);
        messagingTemplate.convertAndSend("/topic/userCount", userCount);
    }

    public int getOnlineUsersCount() {
        return onlineUsers.size();
    }
}
