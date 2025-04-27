package com.jgmt.backend.supportchat;

import com.jgmt.backend.supportchat.dto.UserListUpdateEvent;
import com.jgmt.backend.supportchat.dto.UserWithUnreadDto;
import com.jgmt.backend.users.Role;
import com.jgmt.backend.users.User;
import com.jgmt.backend.users.data.UserResponse;
import com.jgmt.backend.users.repository.UserRepository;
import com.jgmt.backend.users.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageService messageService;
    private final UserService userService;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    // Map to track connected users
    // Map to store session ID to user ID
    private final Map<String, Long> sessionUserMap = new ConcurrentHashMap<>();
    // Map to store user ID to session ID
    private final Map<Long, String> userSessionMap = new ConcurrentHashMap<>();

    /**
     * Handle user identification when connecting
     */
    public void handleUserIdentification(String sessionId, Long userId, String role) {
        // Store session mapping
        sessionUserMap.put(sessionId, userId);
        userSessionMap.put(userId, sessionId);

        // If user is admin, send them the list of users with support requests
        if (Role.ADMIN.name().equals(role)) {
            sendUserListToAdmin(userId);
        }
    }

    /**
     * Handle chat message
     */
    public void handleChatMessage(WebSocketMessage message) {
        // Validate message fields
        if (message.getSenderId() == null || message.getRecipientId() == null || message.getContent() == null) {
            System.err.println("Invalid message received: " + message);
            return;
        }
        // Verify users exist
        User sender = userRepository.findById(message.getSenderId())
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User recipient = userRepository.findById(message.getRecipientId())
                .orElseThrow(() -> new RuntimeException("Recipient not found"));

        // Save message to database
        MessageDto savedMessage = messageService.saveMessage(
                sender.getId(),
                recipient.getId(),
                message.getContent()
        );
        // Prepare proper DTO for sending
        MessageDto responseDto = MessageDto.builder()
                .id(savedMessage.getId())
                .senderId(sender.getId())
                .senderName(sender.getFirstName() + " " + sender.getLastName())
                .recipientId(recipient.getId())
                .content(savedMessage.getContent())
                .timestamp(savedMessage.getTimestamp())
                .read(savedMessage.isRead())
                .build();

        // Send to recipient
        messagingTemplate.convertAndSendToUser(
                String.valueOf(recipient.getId()),
                "/queue/messages",
                responseDto
        );

        // Send confirmation to sender
        messagingTemplate.convertAndSendToUser(
                String.valueOf(sender.getId()),
                "/queue/messages",
                responseDto
        );

        // Update user lists for admins
        if (recipient.getRole() == Role.ADMIN) {
            sendUserListToAdmin(recipient.getId());
        }
        if (sender.getRole() == Role.ADMIN) {
            sendUserListToAdmin(sender.getId());
        }
    }

    /**
     * Send updated user list to admin
     */
    private void sendUserListToAdmin(Long adminId) {
        User admin = userRepository.findById(adminId).orElse(null);
        if (admin != null && admin.getRole() == Role.ADMIN) {
            WebSocketMessage userListMessage = new WebSocketMessage();
            userListMessage.setType("userList");
            userListMessage.setData(messageService.getUsersWithUnreadCounts(adminId));

            messagingTemplate.convertAndSendToUser(
                    String.valueOf(adminId),
                    "/queue/users",
                    userListMessage
            );
        }
    }
    /**
     * Get users with unread message counts
     */
    public List<UserWithUnreadDto> getUsersWithUnreadCounts(Long adminId) {
        // Get users with support requests (users who have sent messages to admin)
        List<User> users = userRepository.findUsersWithSupportRequests();

        return users.stream()
                .map(user -> {
                    UserWithUnreadDto dto = new UserWithUnreadDto();
                    dto.setId(user.getId());
                    dto.setFirstName(user.getFirstName());
                    dto.setLastName(user.getLastName());
                    dto.setEmail(user.getEmail());
                    dto.setRole(user.getRole().name());

                    // Count unread messages from this user to admin
                    int unreadCount = messageRepository.countByRecipientIdAndSenderIdAndReadFalse(
                            adminId, user.getId());
                    dto.setUnreadCount(unreadCount);

                    return dto;
                })
                .collect(Collectors.toList());
    }

    /**
     * Handle user disconnection
     */
    public void handleDisconnect(String sessionId) {
        Long userId = sessionUserMap.remove(sessionId);
        if (userId != null) {
            userSessionMap.remove(userId);
        }
    }

}

