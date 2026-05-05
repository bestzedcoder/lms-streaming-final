package com.hust.lms.streaming.dto.response.quiz;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class QuestionAnswerResponse {
    private String answer;
    private boolean correct;
}
