package com.hust.lms.streaming.repository.jpa;

import com.hust.lms.streaming.model.Enrollment;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, UUID> {
  @Query(value = """
    SELECT COUNT(e) >= 1
    FROM enrollments e INNER JOIN courses c ON e.course_id = c.id
    WHERE e.user_id = :userId AND c.instructor_id = :instructorId
""", nativeQuery = true)
  boolean existsByUserAndInstructor(UUID userId, UUID instructorId);

  @Query(value = """
    SELECT e.*
    FROM enrollments e INNER JOIN courses c ON e.course_id = c.id
    WHERE e.user_id = :userId AND c.slug = :slug
""", nativeQuery = true)
  Optional<Enrollment> findByUserIdAndCourseSlug(UUID userId, String slug);


  @Query(value = """
    SELECT EXISTS (
        SELECT 1
        FROM enrollments e INNER JOIN courses c ON e.course_id = c.id
        WHERE e.user_id = :userId AND c.slug = :slug
    )
""",nativeQuery = true)
  boolean existsByUserIdAndCourseSlug(UUID userId, String slug);

  Optional<Enrollment> findByUserIdAndCourseId(UUID userId, UUID courseId);


  @Query(value = """
    SELECT EXISTS(
        SELECT 1
        FROM sections s INNER JOIN lessons l ON s.id = l.section_id
        WHERE s.course_id = :courseId AND l.video_id = :videoId
    )
""",nativeQuery = true)
  boolean existsVideoInCourse(UUID courseId, UUID videoId);

  @Query(value = """
    SELECT e.*
    FROM enrollments e 
    WHERE e.user_id = :userId
""",nativeQuery = true)
  List<Enrollment> findEnrollmentsByUserId(UUID userId);
}
