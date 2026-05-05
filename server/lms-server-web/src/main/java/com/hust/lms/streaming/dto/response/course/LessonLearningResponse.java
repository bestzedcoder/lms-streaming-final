package com.hust.lms.streaming.dto.response.course;

import com.hust.lms.streaming.enums.LessonType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LessonLearningResponse {
    private String title;
    private LessonType lessonType;
}
