package com.hust.lms.streaming.repository.jpa;

import com.hust.lms.streaming.model.Dto.QuizStatisticsProjection;
import com.hust.lms.streaming.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface QuizRepository extends JpaRepository<Quiz, UUID> {
    @Query(value = """
    SELECT q.*
    FROM quizzes q
    WHERE q.id = :quizId AND q.owner_id = :ownerId
""",nativeQuery = true)
    Optional<Quiz> findByOwner(UUID ownerId, UUID quizId);

    @Query(value = """
    SELECT q.*
    FROM quizzes q
    WHERE q.owner_id = :ownerId
""",nativeQuery = true)
    List<Quiz> findAllByOwner(UUID ownerId);

    @Query(value = """
    SELECT q.*
    FROM quizzes q
    WHERE q.owner_id = :ownerId AND q.status = :status
""",nativeQuery = true)
    List<Quiz> findAllByOwnerAndStatus(UUID ownerId, String status);

    @Query(value = """
    SELECT EXISTS (
        SELECT 1
        FROM quizzes q
        WHERE q.lesson_id = :lessonId
    )
""",nativeQuery = true)
    boolean existsByLesson(UUID lessonId);

    @Query(value = """
    SELECT q.*
    FROM quizzes q
    WHERE q.lesson_id = :lessonId
""",nativeQuery = true)
    Optional<Quiz> findByLesson(UUID lessonId);

    @Query(value = """
    SELECT 
        q.id AS id,
        q.title AS title,
        COUNT(qs.id) AS totalSubmissions,
        q.type AS type,
        COALESCE(AVG(qs.score), 0) AS averageScore
    FROM quizzes q
    LEFT JOIN quiz_version qv 
        ON qv.quiz_id = q.id
    LEFT JOIN quiz_submission qs 
        ON qv.id = qs.quiz_version_id
    WHERE q.lesson_id = :lessonId
    GROUP BY q.id, q.title, q.type
""", nativeQuery = true)
    Optional<QuizStatisticsProjection> getQuizInLesson(UUID lessonId);

    @Query(value = """
    SELECT qv.version_number
    FROM quiz_version qv
    WHERE qv.quiz_id = :quizId
""", nativeQuery = true)
    List<Integer> findVersionsByQuiz(UUID quizId);

}
