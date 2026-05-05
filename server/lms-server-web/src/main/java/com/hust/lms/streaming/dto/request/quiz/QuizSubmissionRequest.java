package com.hust.lms.streaming.dto.request.quiz;

import lombok.Getter;

import java.util.List;
import java.util.UUID;

@Getter
public class QuizSubmissionRequest {
    private String quizId;
    private List<QuestionSubmissionRequest> questions;
}
