package com.hust.lms.streaming.dto.request.instructor;

import lombok.Getter;

@Getter
public class ExportQuizSubmissionRequest {
    private String quizId;
    private int versionNumber;
}
