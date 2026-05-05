package com.hust.lms.streaming.dto.response.quiz;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class QuizResultResponse {
    private String title;
    private int totalQuestions;
    private int correctAnswers;
    private LocalDateTime time;
}
