package com.hust.lms.streaming.service;

import com.hust.lms.streaming.dto.request.instructor.CourseCreatingRequest;
import com.hust.lms.streaming.dto.request.instructor.CourseUpdatingRequest;
import com.hust.lms.streaming.dto.request.instructor.InstructorUpdatingRequest;
import com.hust.lms.streaming.model.Course;
import com.hust.lms.streaming.model.Instructor;
import org.springframework.web.multipart.MultipartFile;

public interface InstructorService {
  Instructor update(InstructorUpdatingRequest request);
  Course createCourse(CourseCreatingRequest request, MultipartFile image);
  Course updateCourse(CourseUpdatingRequest request, MultipartFile image);
}
