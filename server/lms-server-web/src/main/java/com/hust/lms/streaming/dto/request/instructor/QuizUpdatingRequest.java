package com.hust.lms.streaming.dto.request.instructor;

import com.hust.lms.streaming.enums.QuizStatus;
import com.hust.lms.streaming.enums.QuizType;
import lombok.Getter;

@Getter
public class QuizUpdatingRequest {
    private String id;
    private String title;
    private QuizType type;
}
