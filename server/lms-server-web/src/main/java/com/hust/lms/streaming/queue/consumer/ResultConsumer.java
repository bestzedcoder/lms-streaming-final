package com.hust.lms.streaming.queue.consumer;

import com.hust.lms.streaming.configuration.RabbitConfiguration;
import com.hust.lms.streaming.enums.VideoProcessingResult;
import com.hust.lms.streaming.queue.message.VideoProcessingResultMessage;
import com.hust.lms.streaming.service.S3StorageService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class ResultConsumer {
  private final S3StorageService s3StorageService;

  @RabbitListener(queues = RabbitConfiguration.RESULT_PROCESSING_QUEUE, concurrency = "3")
  public void consume(
      VideoProcessingResultMessage message,
      @Header(name = "amqp_messageId") String messageId
  ) {
    log.info("Received video processing message");
    System.out.println(messageId);
    System.out.println(message);
    if (message.getStatus().equals(VideoProcessingResult.FAILURE)) {
      this.s3StorageService.handleVideoProcessingFailure(UUID.fromString(message.getVideoId()));
    }
    else {
      this.s3StorageService.handleVideoProcessingSuccess(UUID.fromString(message.getVideoId()), message.getHlsUrl());
    }
  }
}
