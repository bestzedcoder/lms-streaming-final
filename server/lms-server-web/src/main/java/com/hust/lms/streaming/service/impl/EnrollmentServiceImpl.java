package com.hust.lms.streaming.service.impl;

import com.hust.lms.streaming.enums.EnrollmentStatus;
import com.hust.lms.streaming.exception.ResourceAccessDeniedException;
import com.hust.lms.streaming.model.Enrollment;
import com.hust.lms.streaming.repository.jpa.CourseRepository;
import com.hust.lms.streaming.repository.jpa.EnrollmentRepository;
import com.hust.lms.streaming.service.EnrollmentService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EnrollmentServiceImpl implements EnrollmentService {
  private final EnrollmentRepository enrollmentRepository;
  private final CourseRepository courseRepository;

  @Override
  public void banEnrollment(UUID courseId, UUID userId, String reason) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    if (this.courseRepository.notExistsByIdAndInstructorId(courseId, UUID.fromString(authId))) {
      throw new ResourceAccessDeniedException();
    }

    Enrollment enrollment = this.enrollmentRepository.findByUserIdAndCourseId(userId, courseId).orElse(null);
    if (enrollment == null) return;

    enrollment.setStatus(EnrollmentStatus.BANNED);
    enrollment.setReason(reason);
    this.enrollmentRepository.save(enrollment);
  }

  @Override
  public void activeEnrollment(UUID courseId, UUID userId) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    if (this.courseRepository.notExistsByIdAndInstructorId(courseId, UUID.fromString(authId))) {
      throw new ResourceAccessDeniedException();
    }

    Enrollment enrollment = this.enrollmentRepository.findByUserIdAndCourseId(userId, courseId).orElse(null);
    if (enrollment == null) return;

    enrollment.setStatus(EnrollmentStatus.ACTIVE);
    enrollment.setReason("");
    this.enrollmentRepository.save(enrollment);
  }
}
