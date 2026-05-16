package com.hust.lms.streaming.dto.response.instructor;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InstructorQuizStatisticsResponse {
    private InstructorQuizResponse quiz;
    private List<Integer> versions;
}
