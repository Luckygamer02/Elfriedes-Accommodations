package com.jgmt.backend.supportchat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MessageDto {
    private Long id;
    private Long senderId;
    private String senderName;
    private Long recipientId;
    private String content;
    private LocalDateTime timestamp;
    private boolean read;
}