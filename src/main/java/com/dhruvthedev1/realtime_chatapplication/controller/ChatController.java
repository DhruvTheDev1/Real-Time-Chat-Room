package com.dhruvthedev1.realtime_chatapplication.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import com.dhruvthedev1.realtime_chatapplication.configuration.WebSocketEventListener;
import com.dhruvthedev1.realtime_chatapplication.model.ChatMessage;

@Controller
public class ChatController {

  @Autowired
  private WebSocketEventListener webSocketEventListener;

  @MessageMapping("/chat")
  @SendTo("/topic/public")
  public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {

    return chatMessage;
  }

  @MessageMapping("/chat.addUser")
  @SendTo("/topic/public")
  public ChatMessage addUser(@Payload ChatMessage message, SimpMessageHeaderAccessor headerAccessor) {
    System.out.println("Session attributes before setting username: " + headerAccessor.getSessionAttributes());
    headerAccessor.getSessionAttributes().put("username", message.getUser());
    return message;
  }

  @MessageMapping("/chat.typing")
  @SendTo("/topic/typing")
  public ChatMessage handleTypingEvent(@Payload ChatMessage message) {
    message.setMessageType(ChatMessage.MessageType.TYPING);
    return message;
  }

    @MessageMapping("/requestUserCount")
    @SendTo("/topic/userCount")
    public int getUserCount() {
        return webSocketEventListener.getOnlineUsersCount();
    }
}
