package com.hust.lms.streaming.service;

import com.hust.lms.streaming.dto.message.NotificationMessage;

import java.util.UUID;

public interface NotificationService {

    void sendToStudent(
            UUID userId,
            NotificationMessage message
    );

    void sendToInstructor(
            UUID userId,
            NotificationMessage message
    );

    void sendToAdmin(
            NotificationMessage message
    );
}
