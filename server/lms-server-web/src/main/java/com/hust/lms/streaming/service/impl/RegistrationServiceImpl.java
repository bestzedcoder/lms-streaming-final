package com.hust.lms.streaming.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.hust.lms.streaming.dto.response.registration.RegistrationInstructorResponse;
import com.hust.lms.streaming.dto.response.registration.RegistrationResponse;
import com.hust.lms.streaming.enums.CourseStatus;
import com.hust.lms.streaming.enums.RegistrationStatus;
import com.hust.lms.streaming.exception.BadRequestException;
import com.hust.lms.streaming.mapper.RegistrationMapper;
import com.hust.lms.streaming.model.Course;
import com.hust.lms.streaming.model.Enrollment;
import com.hust.lms.streaming.model.Instructor;
import com.hust.lms.streaming.model.Registration;
import com.hust.lms.streaming.model.User;
import com.hust.lms.streaming.redis.RedisService;
import com.hust.lms.streaming.repository.jpa.CourseRepository;
import com.hust.lms.streaming.repository.jpa.EnrollmentRepository;
import com.hust.lms.streaming.repository.jpa.InstructorRepository;
import com.hust.lms.streaming.repository.jpa.RegistrationRepository;
import com.hust.lms.streaming.repository.jpa.UserRepository;
import com.hust.lms.streaming.service.RegistrationService;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RegistrationServiceImpl implements RegistrationService {
  private final CourseRepository courseRepository;
  private final UserRepository userRepository;
  private final InstructorRepository instructorRepository;
  private final RegistrationRepository registrationRepository;
  private final EnrollmentRepository enrollmentRepository;
  private final RedisService redisService;

  @Override
  public void enrollCourse(String slug, String message) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    if (this.enrollmentRepository.existsByUserIdAndCourseSlug(UUID.fromString(authId), slug) ||
        this.registrationRepository.existsByUser(UUID.fromString(authId), slug, RegistrationStatus.PENDING.toString())) {
      throw new BadRequestException("Khóa học này bạn đã đăng ký");
    }

    User user = this.userRepository.getReferenceById(UUID.fromString(authId));
    Course course = this.courseRepository.findBySlugAndStatus(slug, CourseStatus.PUBLISHED).orElse(null);

    Registration registration = Registration.builder()
        .course(course)
        .student(user)
        .studentMessage(message)
        .build();
    this.registrationRepository.save(registration);
  }

  @Override
  @Transactional
  public void approveRegistration(UUID registrationId, String message) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    Registration registration = this.registrationRepository.findRegistrationByInstructor(UUID.fromString(authId), registrationId, RegistrationStatus.PENDING.toString()).orElse(null);
    if (registration == null) return;
    registration.setStatus(RegistrationStatus.APPROVED);
    registration.setResolvedAt(LocalDateTime.now());
    registration.setTeacherNote(message);

    if (!this.enrollmentRepository.existsByUserAndInstructor(registration.getStudent().getId(), UUID.fromString(authId))) {
      Instructor instructor = this.instructorRepository.getReferenceById(UUID.fromString(authId));
      instructor.setTotalStudent(instructor.getTotalStudent() + 1);
    }

    Enrollment enrollment = Enrollment.builder()
        .course(registration.getCourse())
        .user(registration.getStudent())
        .build();
    this.enrollmentRepository.save(enrollment);
  }

  @Override
  public void rejectRegistration(UUID registrationId, String message) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    Registration registration = this.registrationRepository.findRegistrationByInstructor(UUID.fromString(authId), registrationId, RegistrationStatus.PENDING.toString()).orElse(null);
    if (registration == null) return;
    registration.setStatus(RegistrationStatus.REJECTED);
    registration.setResolvedAt(LocalDateTime.now());
    registration.setTeacherNote(message);
    this.registrationRepository.save(registration);
  }

  @Override
  public List<RegistrationInstructorResponse> getPendingRegistrationsByInstructor() {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    return this.registrationRepository.findRegistrationsByInstructor(UUID.fromString(authId), RegistrationStatus.PENDING.toString())
        .stream().map(RegistrationMapper::toRegistrationInstructorResponse).toList();
  }

  @Override
  public int countPendingRegistrationsByInstructor() {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    return this.registrationRepository.countByInstructor(UUID.fromString(authId), RegistrationStatus.PENDING.toString());
  }

  @Override
  public List<RegistrationResponse> getRegistrationsByStudent() {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    String keyCache = "lms:registration:student:" + authId;

    List<RegistrationResponse> dataCache = this.redisService.getValue(keyCache, new TypeReference<List<RegistrationResponse>>() {});
    if (dataCache != null) return dataCache;

    List<Registration> data = this.registrationRepository.findRegistrationsByStudent(UUID.fromString(authId));
    List<RegistrationResponse> res = data.stream().map(RegistrationMapper::toRegistrationResponse).toList();

    this.redisService.saveKeyAndValue(keyCache, res, 1, TimeUnit.MINUTES);
    return res;
  }
}
