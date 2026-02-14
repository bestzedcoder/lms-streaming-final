package com.hust.lms.streaming.repository;

import com.hust.lms.streaming.model.Course;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, UUID> {
  boolean existsBySlug(String slug);
  Optional<Course> findByIdAndInstructorId(UUID id, UUID instructorId);
  boolean existsByIdAndInstructorId(UUID id, UUID instructorId);
  List<Course> findByInstructorId(UUID instructorId);
}
