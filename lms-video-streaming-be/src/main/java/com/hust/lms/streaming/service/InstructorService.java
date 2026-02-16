package com.hust.lms.streaming.service;

import com.hust.lms.streaming.dto.request.instructor.CourseCreatingRequest;
import com.hust.lms.streaming.dto.request.instructor.CourseStatusRequest;
import com.hust.lms.streaming.dto.request.instructor.CourseUpdatingRequest;
import com.hust.lms.streaming.dto.request.instructor.InstructorUpdatingRequest;
import com.hust.lms.streaming.dto.request.instructor.LessonCancelRequest;
import com.hust.lms.streaming.dto.request.instructor.LessonCreatingRequest;
import com.hust.lms.streaming.dto.request.instructor.LessonUpdatingRequest;
import com.hust.lms.streaming.dto.request.instructor.SectionCancelRequest;
import com.hust.lms.streaming.dto.request.instructor.SectionCreatingRequest;
import com.hust.lms.streaming.dto.request.instructor.SectionUpdatingRequest;
import com.hust.lms.streaming.dto.response.instructor.InstructorCourseDetailsResponse;
import com.hust.lms.streaming.dto.response.instructor.InstructorCourseInfoResponse;
import com.hust.lms.streaming.dto.response.instructor.InstructorCourseResponse;
import com.hust.lms.streaming.dto.response.instructor.InstructorInfoResponse;
import com.hust.lms.streaming.model.Course;
import com.hust.lms.streaming.model.Instructor;
import java.util.List;
import java.util.UUID;
import org.springframework.web.multipart.MultipartFile;

public interface InstructorService {
  Instructor update(InstructorUpdatingRequest request);
  Course createCourse(CourseCreatingRequest request, MultipartFile image);
  Course updateCourse(CourseUpdatingRequest request, MultipartFile image);
  InstructorInfoResponse getInfo();
  InstructorCourseInfoResponse getCourse(UUID id);
  Boolean isUploadInstructor();
  void addSection(SectionCreatingRequest request);
  void updateSection(SectionUpdatingRequest request);
  void deleteSection(SectionCancelRequest request);
  void addLesson(LessonCreatingRequest request);
  void updateLesson(LessonUpdatingRequest request);
  void deleteLesson(LessonCancelRequest request);
  List<InstructorCourseResponse> getAllCourses();
  InstructorCourseDetailsResponse getCourseDetails(UUID id);
  void updateStatusCourse(CourseStatusRequest request);
}
