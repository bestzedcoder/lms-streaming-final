package com.hust.lms.streaming.repository.jpa;

import com.hust.lms.streaming.model.Enrollment;
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
    SELECT EXISTS (
        SELECT 1
        FROM enrollments e
        WHERE e.user_id = :userId AND e.course_id = :courseId
    )
""",nativeQuery = true)
  boolean existsByUserIdAndCourseId(UUID userId, UUID courseId);

  Optional<Enrollment> findByUserIdAndCourseId(UUID userId, UUID courseId);
}
