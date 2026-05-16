package com.hust.lms.streaming.repository.jpa;

import com.hust.lms.streaming.enums.CourseStatus;
import com.hust.lms.streaming.model.Course;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.hust.lms.streaming.model.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CourseRepository extends JpaRepository<Course, UUID> {
  boolean existsBySlug(String slug);
  Optional<Course> findByIdAndInstructorId(UUID id, UUID instructorId);

  @Query(value = """
    SELECT NOT EXISTS (
        SELECT 1
        FROM courses c
        WHERE c.id = :id
          AND c.instructor_id = :instructorId
    )
    """, nativeQuery = true)
  boolean notExistsByIdAndInstructorId(UUID id, UUID instructorId);

  @Query(value = """
    SELECT l.*
    FROM lessons l INNER JOIN sections s ON l.section_id = s.id
    WHERE s.course_id = :courseId
""", nativeQuery = true)
  List<Lesson> findLessonsByCourseId(UUID courseId);

  Optional<Course> findCourseByIdAndInstructorId(UUID id, UUID instructorId);

  List<Course> findCoursesByStatus(CourseStatus status);
  List<Course> findByInstructorId(UUID instructorId);
  List<Course> findCoursesByInstructorId(UUID instructorId);
  Optional<Course> findBySlugAndStatus(String slug, CourseStatus status);
  Integer countByStatus(CourseStatus status);

}
