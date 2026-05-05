package com.hust.lms.streaming.dto.response.quiz;

import com.hust.lms.streaming.enums.QuizStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class QuizResponse {
    private UUID id;
    private String title;
    private int totalQuestions;
    private QuizStatus status;
    private List<QuizQuestionResponse> questions;
}
