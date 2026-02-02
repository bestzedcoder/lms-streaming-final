package com.hust.lms.streaming.event.listener;

import com.hust.lms.streaming.event.custom.UserEvent;
import com.hust.lms.streaming.redis.RedisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class UserEventListener {
  private final RedisService redisService;

  @Async
  @EventListener
  public void handleUserEvent(UserEvent event) {
    log.info("User Event received: type={}, email={}", event.getType(), event.getEmail());

    switch (event.getType()) {
      case CREATED:
      case UPDATED:
      case DELETED:
      case LOCKED:
      case UNLOCKED:
        this.redisService.deleteByPattern("lms:user:search:*");
        log.info("Cleared user list cache due to event: {}", event.getType());
        break;

      default:
        log.warn("No handler for event type: {}", event.getType());
        break;
    }
  }
}