package com.hust.lms.streaming.service.impl;

import com.hust.lms.streaming.dto.request.instructor.CourseCreatingRequest;
import com.hust.lms.streaming.dto.request.instructor.CourseUpdatingRequest;
import com.hust.lms.streaming.dto.request.instructor.InstructorUpdatingRequest;
import com.hust.lms.streaming.exception.BadRequestException;
import com.hust.lms.streaming.model.Category;
import com.hust.lms.streaming.model.Course;
import com.hust.lms.streaming.model.Instructor;
import com.hust.lms.streaming.model.User;
import com.hust.lms.streaming.repository.CategoryRepository;
import com.hust.lms.streaming.repository.CourseRepository;
import com.hust.lms.streaming.repository.InstructorRepository;
import com.hust.lms.streaming.service.InstructorService;
import com.hust.lms.streaming.upload.CloudinaryService;
import com.hust.lms.streaming.upload.CloudinaryUploadResult;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class InstructorServiceImpl implements InstructorService {
  private final InstructorRepository instructorRepository;
  private final CourseRepository courseRepository;
  private final CategoryRepository categoryRepository;
  private final CloudinaryService cloudinaryService;

  @Override
  public Instructor update(InstructorUpdatingRequest request) {
    User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    Instructor instructor = this.instructorRepository.findById(currentUser.getId()).orElse(Instructor.builder()
            .user(currentUser)
            .id(currentUser.getId())
        .build());
    instructor.setTitle(request.getTitle());
    instructor.setBio(request.getBio());
    return this.instructorRepository.save(instructor);
  }

  @Override
  public Course createCourse(CourseCreatingRequest request, MultipartFile image) {
    User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    Instructor instructor = this.instructorRepository.findById(currentUser.getId()).orElseThrow(() -> new BadRequestException("Chưa cập nhật thông tin giảng viên!"));
    if (this.courseRepository.existsBySlug(request.getSlug())) {
      throw new BadRequestException("Khóa học tên khóa học đã tồn tại!");
    }
    Category category = this.categoryRepository.findBySlug(request.getCategorySlug()).orElseThrow(() -> new BadRequestException("Danh mục không tồn tại!"));

    Course course = Course.builder()
        .title(request.getTitle())
        .slug(request.getSlug())
        .description(request.getDescription())
        .level(request.getLevel())
        .category(category)
        .instructor(instructor)
        .build();

    if (image != null) {
      CloudinaryUploadResult res = this.cloudinaryService.uploadImage(image, "courses");
      course.setThumbnail(res.getUrl());
      course.setPublicId(res.getPublicId());
    }
    instructor.getCourses().add(course);
    this.instructorRepository.save(instructor);
    return course;
  }

  @Override
  public Course updateCourse(CourseUpdatingRequest request, MultipartFile image) {
    return null;
  }
}
