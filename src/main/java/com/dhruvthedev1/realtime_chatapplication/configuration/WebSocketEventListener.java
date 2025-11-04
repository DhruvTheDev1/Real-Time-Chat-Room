package com.dhruvthedev1.realtime_chatapplication.configuration;

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

  // when a user joins
  @EventListener
  public void handleWebSocketConnectListener(SessionConnectEvent event) {
    StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
    String username = (String) headerAccessor.getSessionAttributes().get("username");
    if (username != null) {
      log.info("User connected: {}", username);
      ChatMessage chatMessage = ChatMessage.builder()
          .messageType(ChatMessage.MessageType.JOIN)
          .sender(username)
          .build();
      messagingTemplate.convertAndSend("/topic/public", chatMessage);
    }
  }

  // when a user disconnects
  @EventListener
  public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
    StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
    String username = (String) headerAccessor.getSessionAttributes().get("username");

    if (username != null) {
      log.info("User disconnected: {}", username);
      ChatMessage chatMessage = ChatMessage.builder()
          .messageType(ChatMessage.MessageType.LEAVE)
          .sender(username)
          .build();
      messagingTemplate.convertAndSend("/topic/public", chatMessage);
    }
  }
}
