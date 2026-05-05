package com.hust.lms.streaming.dto.request.instructor;

import lombok.Getter;

@Getter
public class RemoveQuizQuestionRequest {
    private String quizId;
    private String quizQuestionId;
}
