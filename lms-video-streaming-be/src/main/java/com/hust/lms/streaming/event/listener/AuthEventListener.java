package com.hust.lms.streaming.event.listener;

import com.hust.lms.streaming.event.custom.AuthEvent;
import com.hust.lms.streaming.mail.MailService;
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
  private final MailService mailService;
  private final RedisService redisService;

  @Value("${app.security.jwt.accessExpiration}")
  private long accessTokenExpire;

  @Async
  @EventListener
  public void handleAuthEvent(AuthEvent event) {
    log.info("Auth Event received: type={}, email={}", event.getType(), event.getEmail());

    try {
      switch (event.getType()) {
        case REGISTER:
          mailService.sendAccountActivationCode(event.getEmail(), event.getData());
          this.redisService.deleteByPattern("lms:user:search:*");
          break;

        case VERIFY_ACCOUNT:
          this.redisService.deleteKey("lms:auth:otp-active:code:username:" + event.getEmail());
          this.redisService.deleteKey("lms:auth:otp-active:attempt:username:" + event.getEmail());
          this.redisService.deleteByPattern("lms:user:search:*");
          break;
        case FORGOT_PASSWORD:
          mailService.sendPasswordResetCode(event.getEmail(), event.getData());
          break;

        case RESET_PASSWORD:
          this.redisService.deleteKey("lms:auth:otp-forgot-password:code:username:" + event.getEmail());
          this.redisService.deleteKey("lms:auth:otp-forgot-password:attempt:username:" + event.getEmail());
          this.redisService.deleteByPattern("lms:user:search:*");
          mailService.sendNewPassword(event.getEmail(), event.getData());
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
  private void handleLogout(AuthEvent event) {
    String token = event.getData();

    if (token != null) {
      String blacklistKey = "lms:auth:blacklist:email" + event.getEmail();
      redisService.saveKeyAndValue(blacklistKey, token, accessTokenExpire, TimeUnit.SECONDS);
      log.info("Token added to blacklist: {}", token);
    }
  }
}
