package com.hust.lms.streaming.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.hust.lms.streaming.dto.request.review.ReviewRequest;
import com.hust.lms.streaming.dto.response.review.ReviewResponse;
import com.hust.lms.streaming.enums.CourseStatus;
import com.hust.lms.streaming.enums.EnrollmentStatus;
import com.hust.lms.streaming.event.custom.CourseEvent;
import com.hust.lms.streaming.event.enums.CourseEventType;
import com.hust.lms.streaming.exception.BadRequestException;
import com.hust.lms.streaming.mapper.CourseElasticsearchMapper;
import com.hust.lms.streaming.mapper.ReviewMapper;
import com.hust.lms.streaming.model.Course;
import com.hust.lms.streaming.model.Enrollment;
import com.hust.lms.streaming.model.Review;
import com.hust.lms.streaming.model.User;
import com.hust.lms.streaming.redis.RedisService;
import com.hust.lms.streaming.repository.jpa.CourseRepository;
import com.hust.lms.streaming.repository.jpa.EnrollmentRepository;
import com.hust.lms.streaming.repository.jpa.ReviewRepository;
import com.hust.lms.streaming.repository.jpa.UserRepository;
import com.hust.lms.streaming.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {
    private final ReviewRepository reviewRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;
    private final CourseRepository courseRepository;
    private final RedisService redisService;

    @Override
    public void createReview(ReviewRequest request, String slug) {
        String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        Enrollment enrollment = this.enrollmentRepository.findByUserIdAndCourseSlug(UUID.fromString(authId), slug)
                .orElse(null);

        if (enrollment == null
                || EnrollmentStatus.BANNED.equals(enrollment.getStatus())
                || !CourseStatus.PUBLISHED.equals(enrollment.getCourse().getStatus())) {
            throw new BadRequestException("Truy cập không hợp lệ");
        }

        Course course = enrollment.getCourse();

        if (this.reviewRepository.existsByUserIdAndCourseId(UUID.fromString(authId), course.getId())) {
            throw new BadRequestException("Bạn đã đánh giá khóa học này rồi");
        }

        User student = this.userRepository.getReferenceById(UUID.fromString(authId));

        Review review = Review.builder()
                .user(student)
                .course(course)
                .rating(request.getRate())
                .content(request.getContent())
                .build();
        this.reviewRepository.save(review);

        this.updateCourseRating(course.getId());
    }

    @Override
    public void updateReview(ReviewRequest request, String slug) {
        String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        Enrollment enrollment = this.enrollmentRepository.findByUserIdAndCourseSlug(UUID.fromString(authId), slug)
                .orElse(null);

        if (enrollment == null
                || EnrollmentStatus.BANNED.equals(enrollment.getStatus())
                || !CourseStatus.PUBLISHED.equals(enrollment.getCourse().getStatus())) {
            throw new BadRequestException("Truy cập không hợp lệ");
        }

        Course course = enrollment.getCourse();
        Review review = this.reviewRepository.findByUserIdAndCourseId(UUID.fromString(authId), course.getId())
                .orElseThrow(() -> new BadRequestException("Đánh giá không tồn tại"));

        review.setContent(review.getContent());
        review.setRating(review.getRating());
        this.reviewRepository.save(review);
        this.updateCourseRating(course.getId());
    }

    @Override
    public ReviewResponse getReview(String slug) {
        String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        Review review = this.reviewRepository.findByUserIdAndCourseSlug(UUID.fromString(authId), slug).orElse(null);
        return ReviewMapper.mapReviewToReviewResponse(review);
    }

    @Override
    public List<ReviewResponse> getReviews(String slug) {
        String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        if (!this.enrollmentRepository.existsByUserIdAndCourseSlug(UUID.fromString(authId), slug)) {
            throw new BadRequestException("Truy cập không hợp lệ");
        }

        String keyCache = "lms:reviews:course:slug:" + slug;
        List<ReviewResponse> dataCache = this.redisService.getValue(keyCache, new TypeReference<List<ReviewResponse>>() {});

        if (dataCache != null) return dataCache;

        List<Review> data = this.reviewRepository.findReviewsByCourseSlug(slug);
        List<ReviewResponse> res = data.stream().map(ReviewMapper::mapReviewToReviewResponse).toList();

        this.redisService.saveKeyAndValue(keyCache, res, 1, TimeUnit.MINUTES);
        return res;
    }

    private void updateCourseRating(UUID courseId) {
        Course course = this.courseRepository.findById(courseId)
                .orElseThrow(() -> new BadRequestException("Khóa học không tồn tại"));

        List<Review> reviews = this.reviewRepository.findReviewsByCourseId(courseId);

        int count = reviews.size();

        double average = reviews.stream()
                .mapToDouble(review -> switch (review.getRating()) {
                    case ONE -> 1.0;
                    case TWO -> 2.0;
                    case THREE -> 3.0;
                    case FOUR -> 4.0;
                    case FIVE -> 5.0;
                })
                .average()
                .orElse(0.0);

        course.setCountRating(count);
        course.setAverageRating(Math.round(average * 10.0) / 10.0);

        this.courseRepository.save(course);
        this.eventPublisher.publishEvent(new CourseEvent(CourseEventType.INFO_UPDATED, course.getInstructor().getId(), courseId , CourseElasticsearchMapper.updatingInfoCourseDocument(course), null));
    }
}
