package com.hust.lms.streaming.queue;

import com.hust.lms.streaming.common.Gen;
import com.hust.lms.streaming.configuration.RabbitConfiguration;
import com.hust.lms.streaming.queue.message.MailMessage;
import com.hust.lms.streaming.queue.message.VideoProcessingMessage;
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

  public void sendProcessingVideo(VideoProcessingMessage msg) {
    rabbitTemplate.convertAndSend(
        RabbitConfiguration.EXCHANGE,
        RabbitConfiguration.ROUTING_KEY_STREAMING,
        msg,
        message -> {
          message.getMessageProperties().setMessageId(Gen.genMessageId("VIDEO"));
          return message;
        }
    );
    log.info("Sent video encode request: {}", msg.getVideoId());
  }
}
