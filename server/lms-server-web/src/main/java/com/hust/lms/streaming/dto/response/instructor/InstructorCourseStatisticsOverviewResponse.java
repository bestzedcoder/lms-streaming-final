package com.hust.lms.streaming.dto.response.instructor;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InstructorCourseStatisticsOverviewResponse {
    private int totalStudents;
    private int totalVideos;
    private int totalLectures;
    private int totalTests;
    private int totalExams;

    private int totalReviews;
    private double averageRating;

    private Map<Double, Integer> scoreTestDistribution;
    private Map<Double, Integer> scoreExamDistribution;
}
