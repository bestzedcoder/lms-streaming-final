package com.hust.lms.streaming.repository.jpa;

import com.hust.lms.streaming.model.Section;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface SectionRepository extends JpaRepository<Section, UUID> {
  Optional<Section> findByIdAndCourseId(UUID id, UUID courseId);
  @Query(value = """
       SELECT NOT EXISTS (
           SELECT 1
           FROM sections c
           WHERE c._id = :id
             AND c._course_id = :courseId
       )
       """, nativeQuery = true)
  boolean notExistsByIdAndCourseId(UUID id, UUID courseId);
}
