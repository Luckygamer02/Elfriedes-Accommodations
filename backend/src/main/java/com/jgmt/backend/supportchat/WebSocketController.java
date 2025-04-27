package com.jgmt.backend.supportchat;


import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Controller
@RequiredArgsConstructor
public class WebSocketController {

    private final WebSocketService webSocketService;

    /**
     * Handle messages sent from clients
     */
    @MessageMapping("/chat")
    public void processMessage(@Payload WebSocketMessage message, StompHeaderAccessor headerAccessor) {
        try {
            String sessionId = headerAccessor.getSessionId();

            if ("identify".equals(message.getType())) {
                // User identification
                webSocketService.handleUserIdentification(
                        sessionId,
                        message.getSenderId(),
                        message.getRole()
                );
            } else if ("message".equals(message.getType())) {
                // Chat message
                webSocketService.handleChatMessage(message);
            }
        } catch (Exception e) {
            // Log the error
            System.err.println("Error processing message: " + e.getMessage());
            e.printStackTrace();
        }
    }


    /**
     * Handle user disconnection
     */
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();

        if (sessionId != null) {
            webSocketService.handleDisconnect(sessionId);
        }
    }
}