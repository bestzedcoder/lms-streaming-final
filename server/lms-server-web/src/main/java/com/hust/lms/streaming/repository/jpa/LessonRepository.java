package com.hust.lms.streaming.repository.jpa;

import com.hust.lms.streaming.model.Lesson;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, UUID> {
  Optional<Lesson> findByIdAndSectionId(UUID id, UUID sectionId);

  @Query(value = """
    SELECT l.*
    FROM lessons l INNER JOIN sections s ON l.section_id = s.id INNER JOIN courses c ON c.id = s.course_id
    WHERE c.id = :courseId AND c.instructor_id = :ownerId AND l.id = :lessonId
""",nativeQuery = true)
  Optional<Lesson> findByOwner(UUID ownerId, UUID courseId, UUID lessonId);

  @Query(value = """
    SELECT l.*
    FROM lessons l INNER JOIN sections s ON l.section_id = s.id
    WHERE s.course_id = :courseId
""",nativeQuery = true)
  List<Lesson> findLessonsByCourse(UUID courseId);

  @Query(value = """
    SELECT l.*
    FROM lessons l INNER JOIN sections s ON l.section_id = s.id INNER JOIN courses c ON c.id = s.course_id
    WHERE c.slug = :slug AND l.id = :lessonId
""",nativeQuery = true)
  Optional<Lesson> findLessonByCourseSlug(String slug, UUID lessonId);

}
