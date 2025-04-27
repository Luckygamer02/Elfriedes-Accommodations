package com.jgmt.backend.supportchat.dto;

import lombok.Data;

@Data
public class UserWithUnreadDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private int unreadCount;
}