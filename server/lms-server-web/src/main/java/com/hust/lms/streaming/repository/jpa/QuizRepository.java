package com.hust.lms.streaming.repository.jpa;

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
}
