package com.hust.lms.streaming.event.listener;

import com.hust.lms.streaming.event.custom.AuthEvent;
import com.hust.lms.streaming.queue.RabbitMQProducer;
import com.hust.lms.streaming.queue.message.MailMessage;
import com.hust.lms.streaming.redis.RedisService;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AuthEventListener {
  private final RedisService redisService;
  private final RabbitMQProducer producer;

  @Value("${app.security.jwt.accessExpiration}")
  private long accessTokenExpire;

  @Async
  @EventListener
  public void handleAuthEvent(AuthEvent event) {
    log.info("Auth Event received: type={}, email={}", event.getType(), event.getEmail());

    try {
      switch (event.getType()) {
        case REGISTER:
          this.sendToQueue(event.getEmail(), event.getType().name(), event.getData());
          this.redisService.deleteByPattern("lms:user:search:*");
          break;

        case VERIFY_ACCOUNT:
          this.redisService.deleteKey("lms:auth:otp-active:code:username:" + event.getEmail());
          this.redisService.deleteKey("lms:auth:otp-active:attempt:username:" + event.getEmail());
          this.redisService.deleteByPattern("lms:user:search:*");
          break;
        case FORGOT_PASSWORD:
          this.sendToQueue(event.getEmail(), event.getType().name(), event.getData());
          break;

        case RESET_PASSWORD:
          this.redisService.deleteKey("lms:auth:otp-forgot-password:code:username:" + event.getEmail());
          this.redisService.deleteKey("lms:auth:otp-forgot-password:attempt:username:" + event.getEmail());
          this.redisService.deleteByPattern("lms:user:search:*");
          this.sendToQueue(event.getEmail(), event.getType().name(), event.getData());
          break;

        case LOGOUT:
          handleLogout(event);
          break;

        default:
          log.warn("No handler found for AuthEventType: {}", event.getType());
          break;
      }
    } catch (Exception e) {
      log.error("Error processing AuthEvent: {}", e.getMessage(), e);
    }
  }

  private void sendToQueue(String email, String type, String data) {
    this.producer.sendEmail(
        MailMessage.<String>builder().to(email).type(type).data(data).build()
    );
  }

  private void handleLogout(AuthEvent event) {
    String token = event.getData();

    if (token != null) {
      String blacklistKey = "lms:auth:blacklist:email" + event.getEmail();
      redisService.saveKeyAndValue(blacklistKey, token, accessTokenExpire, TimeUnit.SECONDS);
      log.info("Token added to blacklist: {}", token);
    }
  }
}
