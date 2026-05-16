package com.hust.lms.streaming.service;

import com.hust.lms.streaming.dto.request.instructor.CourseCreatingRequest;
import com.hust.lms.streaming.dto.request.instructor.CourseUpdatingRequest;
import com.hust.lms.streaming.dto.request.instructor.InstructorUpdatingRequest;
import com.hust.lms.streaming.dto.request.instructor.LessonCancelRequest;
import com.hust.lms.streaming.dto.request.instructor.LessonCreatingRequest;
import com.hust.lms.streaming.dto.request.instructor.LessonUpdatingRequest;
import com.hust.lms.streaming.dto.request.instructor.SectionCancelRequest;
import com.hust.lms.streaming.dto.request.instructor.SectionCreatingRequest;
import com.hust.lms.streaming.dto.request.instructor.SectionUpdatingRequest;
import com.hust.lms.streaming.dto.request.upload.ResourceCreatingRequest;
import com.hust.lms.streaming.dto.request.upload.ResourceUpdatingRequest;
import com.hust.lms.streaming.dto.request.upload.VideoCreatingRequest;
import com.hust.lms.streaming.dto.request.upload.VideoUpdatingRequest;
import com.hust.lms.streaming.dto.response.instructor.*;
import com.hust.lms.streaming.enums.CourseStatus;
import com.hust.lms.streaming.model.Course;
import com.hust.lms.streaming.model.Instructor;
import java.util.List;
import java.util.UUID;
import org.springframework.web.multipart.MultipartFile;

public interface InstructorService {
  void update(InstructorUpdatingRequest request);
  InstructorInfoResponse getInfo();

  void createVideoRecord(VideoCreatingRequest request);
  void createResourceRecord(ResourceCreatingRequest request);
  void updateResourceRecord(ResourceUpdatingRequest request);
  void updateVideoRecord(VideoUpdatingRequest request, MultipartFile image);

  InstructorCourseStatisticsOverviewResponse courseOverview(UUID courseId);
  List<InstructorQuizStatisticsResponse> getQuizzesInCourse(UUID courseId);
  byte[] exportData(UUID quizId, Integer versionNumber);
}
