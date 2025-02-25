package com.jgmt.backend.pushNotifications.projections;

import com.jgmt.backend.util.Client;

@Client
public interface NotificationSubscribersByDate {
    String getDate();
    long getSubscribers();
}