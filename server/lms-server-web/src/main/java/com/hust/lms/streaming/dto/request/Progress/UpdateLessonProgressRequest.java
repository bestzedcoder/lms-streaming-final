package com.hust.lms.streaming.dto.request.Progress;

import lombok.Getter;

@Getter
public class UpdateLessonProgressRequest {
    private int lastWatchedSecond;
    private boolean completed;
}
