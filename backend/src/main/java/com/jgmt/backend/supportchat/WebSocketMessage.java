package com.jgmt.backend.supportchat;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.deser.std.NumberDeserializers;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WebSocketMessage {

    private String type; // "message", "identify", "userList"

    private Long senderId;

    private String senderName;

    private String content;

    private LocalDateTime timestamp;

    private String role;

    private Object data; // For user lists or other data

    // Add validation and proper field type
    //@JsonDeserialize(using = NumberDeserializers.LongDeserializer.class)
    private Long recipientId;

    // Add validation to prevent invalid values
    public void setRecipientId(Long recipientId) {
        if (recipientId == null || recipientId <= 0) {
            throw new IllegalArgumentException("Invalid recipient ID");
        }
        this.recipientId = recipientId;
    }
}