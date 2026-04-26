package com.hust.lms.streaming.dto.request.instructor;

import com.hust.lms.streaming.enums.LessonType;
import lombok.Getter;

@Getter
public class AddResourceForLesson {
    private String courseId;
    private String lessonId;
    private String resourceId;
    private LessonType type;
}
