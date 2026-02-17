package com.hust.lms.streaming.event.listener;

import com.hust.lms.streaming.event.custom.CourseEvent;
import com.hust.lms.streaming.redis.RedisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;


@Slf4j
@Component
@RequiredArgsConstructor
public class CourseEventListener {
  private final RedisService redisService;

  @Async
  @EventListener
  public void handle(CourseEvent event) {
    log.info("Auth Event received: type={}, id={}", event.getType(), event.getCourseId());

    switch (event.getType()) {
      case CREATED:
      case UPDATED_INFO:
      case UPDATED_STATUS:
      case LOCKED:
      case DELETED:
    }

    this.redisService.deleteKey("lms:instructor:list:course:" + event.getInstructorId());
  }
}
