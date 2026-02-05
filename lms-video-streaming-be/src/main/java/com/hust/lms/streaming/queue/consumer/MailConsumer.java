package com.hust.lms.streaming.queue.consumer;

import com.hust.lms.streaming.configuration.RabbitConfiguration;
import com.hust.lms.streaming.mail.MailService;
import com.hust.lms.streaming.queue.message.MailMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class MailConsumer {
  private final MailService mailService;

  @RabbitListener(queues = RabbitConfiguration.MAIL_QUEUE , concurrency = "3")
  public void consume(MailMessage<String> message) {
    log.info("Processing mail: type={}, email={}", message.getType(), message.getTo());

    try {
      switch (message.getType()) {
        case "REGISTER":
          mailService.sendAccountActivationCode(message.getTo(), message.getData());
          break;

        case "FORGOT_PASSWORD":
          mailService.sendPasswordResetCode(message.getTo(), message.getData());
          break;

        case "RESET_PASSWORD":
          mailService.sendNewPassword(message.getTo(), message.getData());
          break;

        case "CREATED":
          mailService.sendNewAccountCredentials(message.getTo(), message.getData());
          break;

        default:
          log.warn("⚠️ Unknown mail type: {}", message.getType());
      }
    } catch (Exception e) {
      log.error("❌ Error sending email to {}: {}", message.getTo(), e.getMessage());
      throw e;
    }
  }
}
