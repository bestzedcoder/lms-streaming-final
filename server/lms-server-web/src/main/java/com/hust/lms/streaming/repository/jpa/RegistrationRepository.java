package com.hust.lms.streaming.repository.jpa;

import com.hust.lms.streaming.model.Registration;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface RegistrationRepository extends JpaRepository<Registration, UUID> {

  @Query(value = """
    SELECT r.*
    FROM registrations r INNER JOIN courses c ON r.course_id = c.id
                         INNER JOIN users u ON r.student_id = u.id
    WHERE c.instructor_id = :instructorId AND r.status = :status
""", nativeQuery = true)
  List<Registration> findRegistrationsByInstructor(UUID instructorId, String status);

  @Query(value = """
    SELECT r.*
    FROM registrations r INNER JOIN courses c ON r.course_id = c.id
    WHERE r.id = :registrationId AND r.status = :status AND c.instructor_id = :instructorId
""",nativeQuery = true)
  Optional<Registration> findRegistrationByInstructor(UUID instructorId, UUID registrationId, String status);

  @Query(value = """
    SELECT COUNT(*)
    FROM registrations r INNER JOIN courses c ON r.course_id = c.id
    WHERE c.instructor_id = :instructorId AND r.status = :status
""", nativeQuery = true)
  int countByInstructor(UUID instructorId, String status);

  @Query(value = """
    SELECT EXISTS (
        SELECT 1
        FROM registrations r INNER JOIN courses c ON r.course_id = c.id
        WHERE r.student_id = :userId AND r.status = :status AND c.slug = :slug
    )
""", nativeQuery = true)
  boolean existsByUser(UUID userId, String slug, String status);
}
