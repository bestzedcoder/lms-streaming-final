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
import com.hust.lms.streaming.dto.response.instructor.InstructorCourseDetailsResponse;
import com.hust.lms.streaming.dto.response.instructor.InstructorCourseInfoResponse;
import com.hust.lms.streaming.dto.response.instructor.InstructorCourseResponse;
import com.hust.lms.streaming.enums.CourseStatus;
import com.hust.lms.streaming.model.Course;
import java.util.List;
import java.util.UUID;
import org.springframework.web.multipart.MultipartFile;

public interface CourseService {
  CourseAuthDetailsResponse getCourseDetails(String slug);

  Course createCourse(CourseCreatingRequest request, MultipartFile image);
  Course updateCourse(CourseUpdatingRequest request, MultipartFile image);
  InstructorCourseInfoResponse getCourse(UUID id);
  void addSection(SectionCreatingRequest request);
  void updateSection(SectionUpdatingRequest request);
  void deleteSection(SectionCancelRequest request);
  void addLesson(LessonCreatingRequest request);
  void updateLesson(LessonUpdatingRequest request);
  void deleteLesson(LessonCancelRequest request);
  List<InstructorCourseResponse> getAllCourses();
  InstructorCourseDetailsResponse getCourseDetails(UUID id);
  void updateStatusCourse(UUID id, CourseStatus status);
}
