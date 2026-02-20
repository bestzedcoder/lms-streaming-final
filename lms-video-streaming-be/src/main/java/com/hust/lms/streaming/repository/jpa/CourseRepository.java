package com.hust.lms.streaming.repository.jpa;

import com.hust.lms.streaming.enums.CourseStatus;
import com.hust.lms.streaming.model.Course;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CourseRepository extends JpaRepository<Course, UUID> {
  boolean existsBySlug(String slug);
  Optional<Course> findByIdAndInstructorId(UUID id, UUID instructorId);

  @Query(value = """
    SELECT NOT EXISTS (
        SELECT 1
        FROM courses c
        WHERE c._id = :id
          AND c._instructor_id = :instructorId
    )
    """, nativeQuery = true)
  boolean notExistsByIdAndInstructorId(UUID id, UUID instructorId);

  List<Course> findCoursesByStatus(CourseStatus status);
  List<Course> findByInstructorId(UUID instructorId);

  Optional<Course> findBySlugAndStatus(String slug, CourseStatus status);
}
