package com.jgmt.backend.supportchat;

import com.jgmt.backend.users.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findBySenderAndRecipientOrderByTimestampAsc(User sender, User recipient);

    @Query("SELECT m FROM Message m WHERE " +
            "(m.sender = :user1 AND m.recipient = :user2) OR " +
            "(m.sender = :user2 AND m.recipient = :user1) " +
            "ORDER BY m.timestamp ASC")
    List<Message> findConversation(User user1, User user2);

    @Query("SELECT COUNT(m) FROM Message m WHERE m.recipient = :user AND m.read = false")
    Integer countUnreadMessagesForUser(User user);

    @Query("SELECT m.sender, COUNT(m) FROM Message m " +
            "WHERE m.recipient = :admin AND m.read = false " +
            "GROUP BY m.sender")
    List<Object[]> countUnreadMessagesByUser(User admin);

    @Query("SELECT u FROM User u WHERE EXISTS (" +
            "  SELECT 1 FROM Message m WHERE " +
            "  (m.sender = u AND m.recipient.role = 'ADMIN') OR " +
            "  (m.recipient = u AND m.sender.role = 'ADMIN')" +
            ")")
    List<User> findUsersWithSupportRequests();



    @Modifying
    @Query("UPDATE Message m SET m.read = true WHERE m.sender.id = :senderId AND m.recipient.id = :recipientId")
    void markMessagesAsRead(@Param("senderId") Long senderId, @Param("recipientId") Long recipientId);

    int countByRecipientIdAndReadFalse(Long recipientId);

    int countByRecipientIdAndSenderIdAndReadFalse(Long recipientId, Long senderId);
}