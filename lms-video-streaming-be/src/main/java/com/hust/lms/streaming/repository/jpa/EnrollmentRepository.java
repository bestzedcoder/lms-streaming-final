package com.hust.lms.streaming.repository.jpa;

import com.hust.lms.streaming.model.Enrollment;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, UUID> {
  @Query("""
SELECT COUNT(e) = 1
FROM Enrollment e
JOIN e.course c
WHERE e.user.id = :userId
AND c.instructor.id = :instructorId
""")
  boolean existsByUserAndInstructor(UUID userId, UUID instructorId);
}
