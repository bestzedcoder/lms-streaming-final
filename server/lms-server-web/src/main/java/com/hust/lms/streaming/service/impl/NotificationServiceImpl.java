package com.hust.lms.streaming.service.impl;

import com.hust.lms.streaming.dto.message.NotificationMessage;
import com.hust.lms.streaming.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public void sendToStudent(UUID userId, NotificationMessage message) {
        messagingTemplate.convertAndSendToUser(
                userId.toString(),
                "/queue/student-notifications",
                message
        );
    }

    @Override
    public void sendToInstructor(UUID userId, NotificationMessage message) {
        messagingTemplate.convertAndSendToUser(
                userId.toString(),
                "/queue/instructor-notifications",
                message
        );
    }

    @Override
    public void sendToAdmin(NotificationMessage message) {
        messagingTemplate.convertAndSend(
                "/topic/admin/notifications",
                message
        );
    }
}
