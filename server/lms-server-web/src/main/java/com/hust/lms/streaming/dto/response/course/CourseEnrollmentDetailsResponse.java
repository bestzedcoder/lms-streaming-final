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
public class CourseEnrollmentDetailsResponse {
    private String title;
    private String slug;
    private String description;
    @Builder.Default
    private List<SectionEnrollmentDetailsResponse> sections = new ArrayList<>();
}
