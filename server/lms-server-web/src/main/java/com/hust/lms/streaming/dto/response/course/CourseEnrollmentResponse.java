package com.hust.lms.streaming.dto.response.course;


import com.hust.lms.streaming.enums.CourseStatus;
import com.hust.lms.streaming.enums.EnrollmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CourseEnrollmentResponse {
    private String slug;
    private String title;
    private String author;
    private String thumbnail;
    private LocalDateTime startTime;
    private CourseStatus status;
    private EnrollmentStatus active;
}
