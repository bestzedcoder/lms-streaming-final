package com.hust.lms.streaming.dto.request.instructor;

import com.hust.lms.streaming.enums.QuizStatus;
import lombok.Getter;

@Getter
public class QuizUpdatingRequest {
    private String id;
    private String title;
    private QuizStatus status;
}
