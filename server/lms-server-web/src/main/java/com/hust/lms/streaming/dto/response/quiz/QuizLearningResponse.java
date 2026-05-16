package com.hust.lms.streaming.dto.response.quiz;

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
public class QuizLearningResponse {
    private UUID quizId;
    private String title;
    private int version;
    private List<QuestionLearningResponse> questions;
}
