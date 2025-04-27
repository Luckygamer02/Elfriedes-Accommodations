package com.jgmt.backend.supportchat.dto;

@lombok.Data
public class MessageRequest {
    private Long recipientId;
    private String content;
}