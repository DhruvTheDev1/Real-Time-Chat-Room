package com.dhruvthedev1.realtime_chatapplication.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dhruvthedev1.realtime_chatapplication.configuration.WebSocketEventListener;

@RestController
public class UserController {
  @Autowired
  private WebSocketEventListener webSocketEventListener;
  // checks if username is taken to avoid duplicate usernames
  @GetMapping("/check-username")
  public ResponseEntity<Boolean> checkUsername(@RequestParam String username) {
    boolean isUsernameTaken = webSocketEventListener.isUsernameTaken(username);
    return ResponseEntity.ok(isUsernameTaken);
  }

}
