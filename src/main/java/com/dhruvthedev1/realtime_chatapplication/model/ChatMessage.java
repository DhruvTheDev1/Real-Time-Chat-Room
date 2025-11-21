package com.dhruvthedev1.realtime_chatapplication.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class ChatMessage {
  private String user; // sender
  private String message; // the content being sent
  private MessageType messageType;

  public enum MessageType {
        CHAT, LEAVE, JOIN, TYPING
    }
}


