package com.jgmt.backend.supportchat;




import com.jgmt.backend.supportchat.dto.MessageRequest;
import com.jgmt.backend.supportchat.dto.UnreadCountResponse;
import com.jgmt.backend.users.Role;
import com.jgmt.backend.users.User;
import com.jgmt.backend.users.data.UserResponse;
import com.jgmt.backend.users.repository.UserRepository;
import com.jgmt.backend.users.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/support")
@RequiredArgsConstructor
public class SupportController {

    private final UserService userService;
    private final MessageService messageService;
    private final UserRepository userRepository;

    /**
     * Get all users with support requests (for admin)
     */
    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getUsersWithSupportRequests() {
        // Verify current user is admin
        User currentUser = getCurrentUser();
        if (currentUser.getRole() != Role.ADMIN) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(userService.getUsersWithSupportRequests());
    }

    /**
     * Get conversation between current user and another user
     */
    @GetMapping("/chat/{userId}")
    public ResponseEntity<List<MessageDto>> getChat(@PathVariable Long userId) {
        User currentUser = getCurrentUser();

        // If admin, can view any conversation
        // If regular user, can only view conversation with admin
        if (currentUser.getRole() != Role.ADMIN) {
            User otherUser = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (otherUser.getRole() != Role.ADMIN) {
                return ResponseEntity.status(403).build();
            }
        }

        return ResponseEntity.ok(messageService.getConversation(currentUser.getId(), userId));
    }

    @GetMapping("/admin")
    public Map<String, Long> getAdminId() {
        User admin = userRepository.findByRole(Role.ADMIN)
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No admin found"));

        return Map.of("adminId", admin.getId());
    }


    /**
     * Send a new message
     */
    @PostMapping("/message")
    public ResponseEntity<MessageDto> sendMessage(@RequestBody MessageRequest request) {
        User currentUser = getCurrentUser();
        User recipient = userRepository.findById(request.getRecipientId())
                .orElseThrow(() -> new RuntimeException("Recipient not found"));

        // Check if message is allowed:
        // 1. Admin can message any user
        // 2. Regular user can only message admin
        if (currentUser.getRole() != Role.ADMIN && recipient.getRole() != Role.ADMIN) {
            return ResponseEntity.status(403).build();
        }

        MessageDto message = messageService.saveMessage(
                currentUser.getId(),
                request.getRecipientId(),
                request.getContent()
        );

        return ResponseEntity.ok(message);
    }

    /**
     * Mark messages as read
     */
    @PostMapping("/read/{userId}")
    public ResponseEntity<?> markMessagesAsRead(@PathVariable Long userId) {
        User currentUser = getCurrentUser();

        messageService.markMessagesAsRead(userId, currentUser.getId());

        return ResponseEntity.ok().build();
    }

    /**
     * Get unread message count for current user
     */
    @GetMapping("/unread")
    public ResponseEntity<UnreadCountResponse> getUnreadCount() {
        User currentUser = getCurrentUser();
        int count = messageService.countUnreadMessages(currentUser.getId());

        return ResponseEntity.ok(new UnreadCountResponse(count));
    }

    // Helper method to get current user
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
