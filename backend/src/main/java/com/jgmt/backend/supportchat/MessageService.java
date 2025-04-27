package com.jgmt.backend.supportchat;


import com.jgmt.backend.supportchat.dto.UserListUpdateEvent;
import com.jgmt.backend.supportchat.dto.UserWithUnreadDto;
import com.jgmt.backend.users.User;
import com.jgmt.backend.users.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public MessageDto saveMessage(@NonNull Long senderId,@NonNull Long recipientId,@NonNull String content) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        User recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new RuntimeException("Recipient not found"));

        Message message = Message.builder()
                .sender(sender)
                .recipient(recipient)
                .content(content)
                .timestamp(LocalDateTime.now())
                .read(false)
                .build();

        Message savedMessage = messageRepository.save(message);
        return convertToDto(savedMessage);
    }

    public List<MessageDto> getConversation(Long user1Id, Long user2Id) {
        User user1 = userRepository.findById(user1Id)
                .orElseThrow(() -> new RuntimeException("User 1 not found"));

        User user2 = userRepository.findById(user2Id)
                .orElseThrow(() -> new RuntimeException("User 2 not found"));

        List<Message> conversation = messageRepository.findConversation(user1, user2);

        // Mark messages as read
        conversation.stream()
                .filter(message -> message.getRecipient().getId().equals(user1Id) && !message.isRead())
                .forEach(message -> {
                    message.setRead(true);
                    messageRepository.save(message);
                });

        return conversation.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public MessageDto convertToDto(Message message) {
        return MessageDto.builder()
                .id(message.getId())
                .senderId(message.getSender().getId())
                .senderName(message.getSender().getUsername())
                .recipientId(message.getRecipient().getId())
                .content(message.getContent())
                .timestamp(message.getTimestamp())
                .read(message.isRead())
                .build();
    }

    public int countUnreadMessages(Long id) {
        User u = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found")) ;
        return messageRepository.countUnreadMessagesForUser(u);
    }

    @Transactional
    public void markMessagesAsRead(Long senderId, Long recipientId) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        User recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new RuntimeException("Recipient not found"));

        List<Message> unreadMessages = messageRepository.findBySenderAndRecipientOrderByTimestampAsc(sender, recipient)
                .stream()
                .filter(message -> !message.isRead())
                .collect(Collectors.toList());

        // Mark messages as read
        unreadMessages.forEach(message -> {
            message.setRead(true);
            messageRepository.save(message);
        });

        // Notify via WebSocket that user list may need to be updated
        if (!unreadMessages.isEmpty()) {
            eventPublisher.publishEvent(new UserListUpdateEvent());
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
}