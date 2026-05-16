package com.hust.lms.streaming.repository.jpa;

import com.hust.lms.streaming.model.Dto.QuizSubmissionExportProjection;
import com.hust.lms.streaming.model.Dto.ScoreDistributionProjection;
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


    @Query(value = """
    SELECT 
        qs.score AS score,
        COUNT(*) AS total
    FROM quiz_submission qs
    INNER JOIN quiz_version qv 
        ON qs.quiz_version_id = qv.id
    INNER JOIN quizzes q
        ON qv.quiz_id = q.id
    WHERE qs.course_id = :courseId
      AND qs.type = :type
    GROUP BY qs.score
    ORDER BY qs.score
    """, nativeQuery = true)
    List<ScoreDistributionProjection> getScoreDistributionLatestVersion(
            UUID courseId,
            String type
    );

    @Query(value = """
    SELECT
        u.first_name AS firstName,
        u.last_name AS lastName,
        u.email AS email,
        u.phone AS phoneNumber,
        qs.title AS quizTitle,
        qv.version_number AS versionNumber,
        qs.total_questions AS totalQuestions,
        qs.correct_answers AS correctAnswers,
        qs.score AS score,
        qs.created_at AS submittedAt
    FROM quiz_submission qs
    INNER JOIN users u
        ON qs.user_id = u.id
    INNER JOIN quiz_version qv
        ON qs.quiz_version_id = qv.id
    WHERE qv.quiz_id = :quizId
      AND qv.version_number = :versionNumber
    ORDER BY qs.created_at DESC
""", nativeQuery = true)
    List<QuizSubmissionExportProjection>
    findExportByQuizAndVersion(
            UUID quizId,
            Integer versionNumber
    );

    @Query(value = """
    SELECT
        u.first_name AS firstName,
        u.last_name AS lastName,
        u.email AS email,
        u.phone AS phoneNumber,
        qs.title AS quizTitle,
        qv.version_number AS versionNumber,
        qs.total_questions AS totalQuestions,
        qs.correct_answers AS correctAnswers,
        qs.score AS score,
        qs.created_at AS submittedAt
    FROM quiz_submission qs
    INNER JOIN users u
        ON qs.user_id = u.id
    INNER JOIN quiz_version qv
        ON qs.quiz_version_id = qv.id
    WHERE qv.quiz_id = :quizId
    ORDER BY qv.version_number DESC,
             qs.created_at DESC
""", nativeQuery = true)
    List<QuizSubmissionExportProjection>
    findAllExportByQuiz(UUID quizId);
}
