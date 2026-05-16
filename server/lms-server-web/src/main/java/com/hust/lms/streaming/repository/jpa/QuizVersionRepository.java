package com.hust.lms.streaming.repository.jpa;

import com.hust.lms.streaming.model.QuizVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.UUID;

public interface QuizVersionRepository extends JpaRepository<QuizVersion, UUID> {

    @Query(value = """
    SELECT qv.*
    FROM quiz_version qv
    WHERE qv.quiz_id = :quizId
    ORDER BY qv.version_number DESC 
    LIMIT 1
""", nativeQuery = true)
    Optional<QuizVersion> findLatestVersionByQuizId(UUID quizId);

    @Query(value = """
    SELECT qv.*
    FROM quiz_version qv
    WHERE qv.quiz_id = :quizId AND qv.version_number = :version
""", nativeQuery = true)
    Optional<QuizVersion> findVersionByQuizIdAndVersion(UUID quizId, int version);
}
