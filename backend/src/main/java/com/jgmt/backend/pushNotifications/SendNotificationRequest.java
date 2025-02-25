package com.jgmt.backend.pushNotifications;

import com.jgmt.backend.util.Client;
import lombok.Data;

@Data
@Client
public class SendNotificationRequest {
    private String title;
    private String message;
    private String url;
}
