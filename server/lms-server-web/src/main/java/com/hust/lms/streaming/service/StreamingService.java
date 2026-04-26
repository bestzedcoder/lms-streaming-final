package com.hust.lms.streaming.service;

import java.util.UUID;

public interface StreamingService {
    String start(UUID videoId, UUID courseId);
}
