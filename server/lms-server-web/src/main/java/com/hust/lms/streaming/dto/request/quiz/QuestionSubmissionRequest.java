package com.hust.lms.streaming.dto.request.quiz;

import lombok.Getter;

import java.util.List;

@Getter
public class QuestionSubmissionRequest {
    private String questionId;
    private List<String> answers;
}
