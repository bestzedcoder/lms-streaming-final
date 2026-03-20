package com.hust.lms.streaming.event.listener;

import com.hust.lms.streaming.event.custom.UserEvent;
import com.hust.lms.streaming.queue.RabbitMQProducer;
import com.hust.lms.streaming.queue.message.MailMessage;
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
  private final RabbitMQProducer producer;

  @Async
  @EventListener
  public void handleUserEvent(UserEvent event) {
    log.info("User Event received: type={}, email={}", event.getType(), event.getEmail());

    try {
      switch (event.getType()) {
        case CREATED:
          this.producer.sendEmail(
              MailMessage.<String>builder().to(event.getEmail()).type(event.getType().name()).data(event.getData()).build()
          );
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
    } catch (Exception e) {
      log.error("Error processing UserEvent: {}", e.getMessage(), e);
    }
  }
}