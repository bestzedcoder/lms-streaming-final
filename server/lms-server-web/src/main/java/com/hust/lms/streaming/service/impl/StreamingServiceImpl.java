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
    private String PREFIX_KEY;

    @Value("${app.security.hash.key}")
    private String HASH_KEY;

    @Value("${app.security.streaming.key}")
    private String SECRET_KEY_STREAMING;



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
        String hashCode = HashString.hash(video.getHlsUrl(), HASH_KEY);
        String dataCache = this.redisService.getValue(PREFIX_KEY + hashCode, new TypeReference<String>() {});

        if (dataCache == null) {
            this.redisService.saveKeyAndValue(PREFIX_KEY + hashCode, video.getHlsUrl() , 10 , TimeUnit.MINUTES);
        }

        String token = HashString.generatePlaybackToken(hashCode, SECRET_KEY_STREAMING, 600);

        return "/hls/" + hashCode + "/master.m3u8?token=" + token;
    }

    @Override
    public String startTest(UUID videoId) {
        Video video = this.videoRepository.findById(videoId).orElseThrow(() -> new BadRequestException("Video đã bị xóa hoặc không tồn tại"));
        if (!video.getStatus().equals(VideoStatus.READY) || video.getHlsUrl() == null) {
            throw new BadRequestException("Video đã gặp sự cố");
        }
        String hashCode = HashString.hash(video.getHlsUrl(), HASH_KEY);
        String dataCache = this.redisService.getValue(PREFIX_KEY + hashCode, new TypeReference<String>() {});

        if (dataCache == null) {
            this.redisService.saveKeyAndValue(PREFIX_KEY + hashCode, video.getHlsUrl() , 10 , TimeUnit.MINUTES);
        }

        String token = HashString.generatePlaybackToken(hashCode, SECRET_KEY_STREAMING, 600);

        return "/hls/" + hashCode + "/master.m3u8?token=" + token;
    }

}
