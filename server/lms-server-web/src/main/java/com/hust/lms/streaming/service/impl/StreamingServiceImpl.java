package com.hust.lms.streaming.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.hust.lms.streaming.common.HashString;
import com.hust.lms.streaming.enums.EnrollmentStatus;
import com.hust.lms.streaming.enums.VideoStatus;
import com.hust.lms.streaming.exception.BadRequestException;
import com.hust.lms.streaming.model.Enrollment;
import com.hust.lms.streaming.model.Video;
import com.hust.lms.streaming.redis.RedisService;
import com.hust.lms.streaming.repository.jpa.EnrollmentRepository;
import com.hust.lms.streaming.repository.jpa.VideoRepository;
import com.hust.lms.streaming.service.StreamingService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class StreamingServiceImpl implements StreamingService {

    @Value("${app.redis.key-streaming}")
    private String prefixKey;

    @Value("${app.security.hash.key}")
    private String hashKey;

    private final VideoRepository videoRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final RedisService redisService;

    @Override
    public String start(UUID videoId, UUID courseId) {
        String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();

        Enrollment enrollment = this.enrollmentRepository.findByUserIdAndCourseId(UUID.fromString(authId), courseId).orElse(null);

        if (enrollment == null
                || !enrollment.getStatus().equals(EnrollmentStatus.ACTIVE)
                || !this.enrollmentRepository.existsVideoInCourse(courseId, videoId)) {
            throw new BadRequestException("Truy cập không hợp lệ");
        }

        Video video = this.videoRepository.findById(videoId).orElseThrow(() -> new BadRequestException("Video đã bị xóa hoặc không tồn tại"));
        if (!video.getStatus().equals(VideoStatus.READY) || video.getHlsUrl() == null) {
            throw new BadRequestException("Video đã gặp sự cố");
        }
        String hashCode = HashString.hash(video.getHlsUrl(), hashKey);
        String dataCache = this.redisService.getValue(prefixKey + hashCode, new TypeReference<String>() {});

        if (dataCache == null) {
            this.redisService.saveKeyAndValue(prefixKey + hashCode, video.getHlsUrl() , 10 , TimeUnit.MINUTES);
        }

        return "/hls/video/streaming?short-link=" + hashCode;
    }

}
