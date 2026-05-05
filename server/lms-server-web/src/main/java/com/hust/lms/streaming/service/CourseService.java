package com.hust.lms.streaming.service;

import com.hust.lms.streaming.dto.request.instructor.CourseCreatingRequest;
import com.hust.lms.streaming.dto.request.instructor.CourseUpdatingRequest;
import com.hust.lms.streaming.dto.request.instructor.LessonCancelRequest;
import com.hust.lms.streaming.dto.request.instructor.LessonCreatingRequest;
import com.hust.lms.streaming.dto.request.instructor.LessonUpdatingRequest;
import com.hust.lms.streaming.dto.request.instructor.SectionCancelRequest;
import com.hust.lms.streaming.dto.request.instructor.SectionCreatingRequest;
import com.hust.lms.streaming.dto.request.instructor.SectionUpdatingRequest;
import com.hust.lms.streaming.dto.response.course.CourseAuthDetailsResponse;
import com.hust.lms.streaming.dto.response.course.CourseEnrollmentDetailsResponse;
import com.hust.lms.streaming.dto.response.course.CourseEnrollmentResponse;
import com.hust.lms.streaming.dto.response.course.LessonLearningResponse;
import com.hust.lms.streaming.dto.response.instructor.*;
import com.hust.lms.streaming.dto.response.quiz.SelectQuizResponse;
import com.hust.lms.streaming.dto.response.resource.SelectLectureResponse;
import com.hust.lms.streaming.dto.response.resource.SelectVideoResponse;
import com.hust.lms.streaming.enums.CourseStatus;
import java.util.List;
import java.util.UUID;

import com.hust.lms.streaming.enums.LessonType;
import org.springframework.web.multipart.MultipartFile;

public interface CourseService {
  CourseAuthDetailsResponse getCourseDetails(String slug);

  void createCourse(CourseCreatingRequest request, MultipartFile image);
  void updateCourse(CourseUpdatingRequest request, MultipartFile image);
  InstructorCourseInfoResponse getCourse(UUID id);
  List<InstructorLessonDetailResponse> getLessonsInCourse(UUID courseId);
  void addSection(SectionCreatingRequest request);
  void updateSection(SectionUpdatingRequest request);
  void deleteSection(SectionCancelRequest request);
  void addLesson(LessonCreatingRequest request);
  void updateLesson(LessonUpdatingRequest request);
  void deleteLesson(LessonCancelRequest request);
  List<InstructorCourseResponse> getAllCourses();
  InstructorCourseDetailsResponse getCourseDetails(UUID id);
  void updateStatusCourse(UUID id, CourseStatus status);

  List<SelectVideoResponse> getAllVideo();
  List<SelectLectureResponse> getAllLecture();
  List<SelectQuizResponse> getAllQuiz();

  void addResourceForLesson(UUID courseId, UUID lessonId, UUID resourceId, LessonType type);
  void removeResourceForLesson(UUID courseId, UUID lessonId);


  List<CourseEnrollmentResponse> getCoursesByStudent();
  CourseEnrollmentDetailsResponse getCourseByStudent(String slug);
  LessonLearningResponse learningStart(String slug, UUID lessonId);
}
