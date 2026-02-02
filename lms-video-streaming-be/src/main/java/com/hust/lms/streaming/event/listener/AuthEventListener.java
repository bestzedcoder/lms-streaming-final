package com.hust.lms.streaming.event.listener;

import com.hust.lms.streaming.event.custom.AuthEvent;
import com.hust.lms.streaming.mail.MailService;
import com.hust.lms.streaming.redis.RedisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AuthEventListener {
  private final MailService mailService;
  private final RedisService redisService;

  @Async
  @EventListener
  public void handleAuthEvent(AuthEvent authEvent) {}
}
