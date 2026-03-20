package com.hust.lms.streaming.queue;

import com.hust.lms.streaming.configuration.RabbitConfiguration;
import com.hust.lms.streaming.queue.message.MailMessage;
import com.hust.lms.streaming.queue.message.VideoMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class RabbitMQProducer {
  private final RabbitTemplate rabbitTemplate;

  public void sendEmail(MailMessage<?> message) {
    rabbitTemplate.convertAndSend(
        RabbitConfiguration.EXCHANGE,
        RabbitConfiguration.ROUTING_KEY_MAIL,
        message
    );
    log.info("Sent mail message: {}", message.getTo());
  }

  // Hàm gửi video
  public void sendVideoEncode(VideoMessage message) {
    rabbitTemplate.convertAndSend(
        RabbitConfiguration.EXCHANGE,
        RabbitConfiguration.ROUTING_KEY_VIDEO,
        message
    );
//    log.info("Sent video encode request: {}", message.getVideoId());
  }
}
