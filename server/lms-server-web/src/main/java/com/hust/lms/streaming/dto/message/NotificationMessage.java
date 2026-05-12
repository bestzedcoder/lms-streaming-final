package com.hust.lms.streaming.dto.message;

import com.hust.lms.streaming.enums.NotificationType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationMessage {
    private NotificationType type;
    private String title;
    private String content;
    private LocalDateTime createdAt;
}
