package com.hust.lms.streaming.dto.response.course;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SectionEnrollmentDetailsResponse {
    private String title;
    @Builder.Default
    private List<LessonEnrollmentDetailsResponse> lessons = new ArrayList<>();
}
