package com.hust.lms.streaming.repository.jpa;

import com.hust.lms.streaming.model.Question;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface QuestionRepository extends JpaRepository<Question, UUID> {

  @Query(value = """
    SELECT q.*
    FROM questions q
    WHERE q.owner_id = :ownerId AND q.id = :questionId
""", nativeQuery = true)
  Optional<Question> findByOwner(UUID questionId, UUID ownerId);


  @Query(value = """
    SELECT q.*
    FROM questions q
    WHERE q.owner_id = :ownerId AND q.category_id = :categoryId
""",nativeQuery = true)
  List<Question> getQuestionsByOwner(UUID ownerId, UUID categoryId);
}
