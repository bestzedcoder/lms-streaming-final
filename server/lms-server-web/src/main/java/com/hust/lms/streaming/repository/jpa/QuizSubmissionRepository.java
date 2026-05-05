package com.hust.lms.streaming.repository.jpa;

import com.hust.lms.streaming.model.QuizSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface QuizSubmissionRepository extends JpaRepository<QuizSubmission, UUID> {

    @Query(value = """
    SELECT q.*
    FROM quiz_submission q INNER JOIN courses c ON q.course_id = c.id
    WHERE c.slug = :slug AND q.user_id = :studentId
""",nativeQuery = true)
    List<QuizSubmission> findByStudent(String slug, UUID studentId);
}
