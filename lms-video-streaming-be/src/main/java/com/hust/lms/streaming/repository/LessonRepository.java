package com.hust.lms.streaming.repository;

import com.hust.lms.streaming.model.Lesson;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, UUID> {
  Optional<Lesson> findByIdAndSectionId(UUID id, UUID sectionId);
}
