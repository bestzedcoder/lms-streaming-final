package com.hust.lms.streaming.event.listener;

import com.hust.lms.streaming.enums.ResourceStatus;
import com.hust.lms.streaming.enums.VideoStatus;
import com.hust.lms.streaming.event.custom.ResourceValidationEvent;
import com.hust.lms.streaming.event.custom.VideoProcessingEvent;
import com.hust.lms.streaming.event.enums.ResourceType;
import com.hust.lms.streaming.model.Resource;
import com.hust.lms.streaming.model.Video;
import com.hust.lms.streaming.queue.RabbitMQProducer;
import com.hust.lms.streaming.queue.message.VideoProcessingMessage;
import com.hust.lms.streaming.repository.jpa.ResourceRepository;
import com.hust.lms.streaming.repository.jpa.VideoRepository;
import com.hust.lms.streaming.service.FileValidationService;
import com.hust.lms.streaming.service.S3StorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@Slf4j
@RequiredArgsConstructor
public class VideoEventListener {
  private final RabbitMQProducer producer;
  private final VideoRepository videoRepository;
  private final ResourceRepository resourceRepository;
  private final FileValidationService fileValidationService;
  private final S3StorageService s3StorageService;

  @Value("${app.storage.s3.bucket-staging}")
  private String STAGING_BUCKET;

  @Async
  @EventListener
  public void handleProcessVideo(VideoProcessingEvent event) {
    VideoProcessingMessage message = new VideoProcessingMessage();
    message.setOriginalUrl(event.getOriginalUrl());
    message.setVideoId(event.getVideoId().toString());
    message.setOwnerId(event.getOwnerId().toString());
    producer.sendProcessingVideo(message);
  }

  @Async
  @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
  public void handleValidationResource(ResourceValidationEvent event) {
    switch (event.getType()) {
      case VIDEO -> videoValidation(event);
      case LECTURE -> lectureValidation(event);
      default -> log.warn("Dạng tài nguyên không tồn tại: {}", event.getType());
    }
  }

  private void lectureValidation(ResourceValidationEvent event) {
    Resource resource = this.resourceRepository.findById(event.getResourceId()).orElse(null);
    if (resource == null || !resource.getStatus().equals(ResourceStatus.VALIDATING)) {
      log.info("Lecture đang ở trạng thái khác");
      return;
    }

    try {
      this.fileValidationService.validateObjectFromMinio(event.getOriginalUrl(), ResourceType.LECTURE);
      resource.setStatus(ResourceStatus.PENDING_REVIEW);
    } catch (Exception e) {
      s3StorageService.deleteFromStaging(event.getOriginalUrl(), STAGING_BUCKET);
      resource.setStatus(ResourceStatus.DELETED);
    } finally {
      this.resourceRepository.save(resource);
    }
  }

  private void videoValidation(ResourceValidationEvent event) {
    Video video = this.videoRepository.findById(event.getResourceId()).orElse(null);
    if (video == null || !video.getStatus().equals(VideoStatus.VALIDATING)) {
      log.info("Video đang ở trạng thái khác");
      return;
    }

    try {
      this.fileValidationService.validateObjectFromMinio(event.getOriginalUrl(), ResourceType.VIDEO);
      video.setStatus(VideoStatus.PENDING_REVIEW);
    } catch (Exception e) {
      s3StorageService.deleteFromStaging(event.getOriginalUrl(), STAGING_BUCKET);
      video.setStatus(VideoStatus.DELETED);
    } finally {
      this.videoRepository.save(video);
    }
  }

}
