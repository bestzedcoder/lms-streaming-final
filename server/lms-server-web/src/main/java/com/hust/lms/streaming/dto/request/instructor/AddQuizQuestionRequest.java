package com.hust.lms.streaming.dto.request.instructor;

import lombok.Getter;

@Getter
public class AddQuizQuestionRequest {
    private String quizId;
    private String questionId;
}
