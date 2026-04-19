package com.hust.lms.streaming.event.listener;

import com.hust.lms.streaming.common.Gen;
import com.hust.lms.streaming.event.custom.VideoEvent;
import com.hust.lms.streaming.queue.RabbitMQProducer;
import com.hust.lms.streaming.queue.message.VideoProcessingMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class VideoEventListener {
  private final RabbitMQProducer producer;

  @Async
  @EventListener
  public void handleProcessVideo(VideoEvent event) {
    VideoProcessingMessage message = new VideoProcessingMessage();
    message.setOriginalUrl(event.getOriginalUrl());
    message.setVideoId(event.getVideoId().toString());
    message.setOwnerId(event.getOwnerId().toString());
    producer.sendProcessingVideo(message);
  }

}
