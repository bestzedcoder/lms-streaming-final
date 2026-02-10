package com.hust.lms.streaming.repository;

import com.hust.lms.streaming.model.Course;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, UUID> {
  boolean existsBySlug(String slug);
}
