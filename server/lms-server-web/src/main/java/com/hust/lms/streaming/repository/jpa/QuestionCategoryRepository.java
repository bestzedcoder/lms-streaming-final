package com.hust.lms.streaming.repository.jpa;

import com.hust.lms.streaming.model.QuestionCategory;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface QuestionCategoryRepository extends JpaRepository<QuestionCategory, UUID> {

  @Query(value = """
    SELECT qc.*
    FROM question_category qc
    WHERE qc.id = :id AND qc.owner_id = :instructorId
""", nativeQuery = true)
  Optional<QuestionCategory> findByIdAndOwnerId(UUID id, UUID instructorId);

  List<QuestionCategory> findByOwnerId(UUID instructorId);
}
