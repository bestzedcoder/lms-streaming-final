package com.hust.lms.streaming.dto.response.quiz;

import com.hust.lms.streaming.enums.QuestionType;
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
public class QuestionLearningResponse {
    private UUID questionId;
    private String content;
    private QuestionType type;
    private List<AnswerLearningResponse> answers;
}
