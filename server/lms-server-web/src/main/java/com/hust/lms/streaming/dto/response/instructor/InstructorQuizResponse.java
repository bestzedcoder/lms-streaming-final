package com.hust.lms.streaming.dto.response.instructor;

import com.hust.lms.streaming.enums.QuizType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InstructorQuizResponse {
    private UUID quizId;
    private String title;
    private int totalSubmissions;
    private QuizType type;
    private double averageScore;
}
