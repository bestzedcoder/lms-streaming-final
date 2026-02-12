package com.hust.lms.streaming.service;

import com.hust.lms.streaming.dto.request.instructor.CourseCreatingRequest;
import com.hust.lms.streaming.dto.request.instructor.CourseUpdatingRequest;
import com.hust.lms.streaming.dto.request.instructor.InstructorUpdatingRequest;
import com.hust.lms.streaming.dto.response.instructor.InstructorCourseResponse;
import com.hust.lms.streaming.dto.response.instructor.InstructorInfoResponse;
import com.hust.lms.streaming.model.Course;
import com.hust.lms.streaming.model.Instructor;
import java.util.UUID;
import org.springframework.web.multipart.MultipartFile;

public interface InstructorService {
  Instructor update(InstructorUpdatingRequest request);
  Course createCourse(CourseCreatingRequest request, MultipartFile image);
  Course updateCourse(UUID id, CourseUpdatingRequest request, MultipartFile image);
  InstructorInfoResponse getInfo();
  InstructorCourseResponse getCourse(UUID id);
  Boolean isUploadInstructor();
}
