package com.hust.lms.streaming.dto.response.instructor;

import com.hust.lms.streaming.enums.LessonType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InstructorLessonDetailResponse {
    private UUID id;
    private String title;
    private LessonType lessonType;
    private boolean preview;
    private boolean hasResource;
}
