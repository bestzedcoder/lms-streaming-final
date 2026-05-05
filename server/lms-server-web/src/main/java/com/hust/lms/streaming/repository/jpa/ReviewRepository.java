package com.hust.lms.streaming.repository.jpa;

import com.hust.lms.streaming.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReviewRepository extends JpaRepository<Review, UUID> {
    List<Review> findReviewsByCourseId(UUID courseId);
    List<Review> findReviewsByCourseSlug(String slug);
    boolean existsByUserIdAndCourseId(UUID userId, UUID courseId);
    Optional<Review> findByUserIdAndCourseId(UUID userId, UUID courseId);
    Optional<Review> findByUserIdAndCourseSlug(UUID userId, String slug);
}
