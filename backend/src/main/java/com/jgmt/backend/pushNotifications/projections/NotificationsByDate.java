package com.jgmt.backend.pushNotifications.projections;

import com.jgmt.backend.util.Client;
import java.time.LocalDateTime;

@Client
public interface NotificationsByDate {
    String getDate();
    long getSent();
    long getDelivered();
}