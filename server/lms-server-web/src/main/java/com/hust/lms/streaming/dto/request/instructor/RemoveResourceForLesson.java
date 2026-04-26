package com.hust.lms.streaming.dto.request.instructor;

import lombok.Getter;

@Getter
public class RemoveResourceForLesson {
    private String courseId;
    private String lessonId;
}
