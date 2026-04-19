package com.hust.lms.lms_core_streaming.queue;

import com.hust.lms.lms_core_streaming.common.Gen;
import com.hust.lms.lms_core_streaming.config.RabbitConfig;
import com.hust.lms.lms_core_streaming.dto.VideoProcessingResultMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class RabbitMQProducer {
  private final RabbitTemplate rabbitTemplate;

  public void sendProcessingResult(VideoProcessingResultMessage msg) {
    rabbitTemplate.convertAndSend(
        RabbitConfig.EXCHANGE,
        RabbitConfig.ROUTING_KEY_RESULT,
        msg,
        message -> {
          MessageProperties messageProperties = message.getMessageProperties();
          messageProperties.setMessageId(Gen.genMessageId("RESULT-PROCESSING"));
          return message;
        }
    );
  }
}
