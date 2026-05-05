package com.hust.lms.streaming.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.hust.lms.streaming.common.HashString;
import com.hust.lms.streaming.dto.request.upload.ResourcePreviewResponse;
import com.hust.lms.streaming.dto.response.quiz.QuizLearningResponse;
import com.hust.lms.streaming.enums.*;
import com.hust.lms.streaming.event.enums.ResourceType;
import com.hust.lms.streaming.exception.BadRequestException;
import com.hust.lms.streaming.mapper.QuizMapper;
import com.hust.lms.streaming.model.*;
import com.hust.lms.streaming.redis.RedisService;
import com.hust.lms.streaming.repository.jpa.EnrollmentRepository;
import com.hust.lms.streaming.repository.jpa.LessonRepository;
import com.hust.lms.streaming.repository.jpa.QuizRepository;
import com.hust.lms.streaming.repository.jpa.VideoRepository;
import com.hust.lms.streaming.service.LearningService;
import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MinioClient;
import io.minio.http.Method;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class LearningServiceImpl implements LearningService {

    @Value("${app.redis.key-streaming}")
    private String PREFIX_KEY;

    @Value("${app.security.hash.key}")
    private String HASH_KEY;

    @Value("${app.security.streaming.key}")
    private String SECRET_KEY_STREAMING;

    @Value("${app.storage.s3.bucket-staging}")
    private String STAGING_BUCKET;

    private final EnrollmentRepository enrollmentRepository;
    private final LessonRepository lessonRepository;
    private final QuizRepository quizRepository;
    private final MinioClient minioClient;
    private final RedisService redisService;

    @Override
    public String learnVideo(String slug, UUID lessonId) {
        if (this.validationUserInCourse(slug)) {
            throw new BadRequestException("Truy cập không hợp lệ");
        }

        Lesson lesson = this.lessonRepository.findLessonByCourseSlug(slug, lessonId)
                .orElse(null);

        if (lesson == null || !LessonType.VIDEO.equals(lesson.getLessonType()) || lesson.getVideo() == null) {
            throw new BadRequestException("Bài học không hợp lệ");
        }

        Video video = lesson.getVideo();
        if (!VideoStatus.READY.equals(video.getStatus()) || video.getHlsUrl() == null) {
            throw new BadRequestException("Video đã gặp sự cố");
        }

        String hashCode = HashString.hash(video.getHlsUrl(), HASH_KEY);
        String dataCache = this.redisService.getValue(PREFIX_KEY + hashCode, new TypeReference<String>() {});

        if (dataCache == null) {
            this.redisService.saveKeyAndValue(PREFIX_KEY + hashCode, video.getHlsUrl() , 10 , TimeUnit.MINUTES);
        }

        String token = HashString.generatePlaybackToken(hashCode, SECRET_KEY_STREAMING, 600);

        return "/hls/" + hashCode + "/" + token + "/master.m3u8";
    }

    @Override
    public String learnLecture(String slug, UUID lessonId) {
        if (this.validationUserInCourse(slug)) {
            throw new BadRequestException("Truy cập không hợp lệ");
        }

        Lesson lesson = this.lessonRepository.findLessonByCourseSlug(slug, lessonId)
                .orElse(null);

        if (lesson == null || !LessonType.TEXT.equals(lesson.getLessonType()) || lesson.getResource() == null) {
            throw new BadRequestException("Bài học không hợp lệ");
        }

        Resource lecture = lesson.getResource();
        if (!ResourceStatus.APPROVED.equals(lecture.getStatus()) || lecture.getUrl() == null) {
            throw new BadRequestException("Bài giảng đã gặp sự cố");
        }

        try {
            return minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Method.GET)
                            .bucket(STAGING_BUCKET)
                            .object(lecture.getUrl())
                            .expiry(15, TimeUnit.MINUTES)
                            .build());

        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi tạo link từ MinIO", e);
        }
    }

    @Override
    public QuizLearningResponse learnQuiz(String slug, UUID lessonId) {
        if (this.validationUserInCourse(slug)) {
            throw new BadRequestException("Truy cập không hợp lệ");
        }

        Lesson lesson = this.lessonRepository.findLessonByCourseSlug(slug, lessonId)
                .orElse(null);

        if (lesson == null || !LessonType.QUIZ.equals(lesson.getLessonType())) {
            throw new BadRequestException("Bài học không hợp lệ");
        }

        Quiz quiz = this.quizRepository.findByLesson(lessonId).orElse(null);
        if (quiz == null || !QuizStatus.PUBLISHED.equals(quiz.getStatus())) {
            throw new BadRequestException("Bài kiểm tra chưa sẵn sàng");
        }

        return QuizMapper.mapQuizToQuizLearningResponse(quiz);
    }


    private boolean validationUserInCourse(String slug) {
        String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        Enrollment enrollment =  this.enrollmentRepository.findByUserIdAndCourseSlug(UUID.fromString(authId), slug).orElse(null);
        return enrollment == null || !EnrollmentStatus.ACTIVE.equals(enrollment.getStatus());
    }

}
