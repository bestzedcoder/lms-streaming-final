package com.hust.lms.streaming.repository.jpa;

import com.hust.lms.streaming.model.Section;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SectionRepository extends JpaRepository<Section, UUID> {
  Optional<Section> findByIdAndCourseId(UUID id, UUID courseId);
  boolean existsByIdAndCourseId(UUID id, UUID courseId);
}
