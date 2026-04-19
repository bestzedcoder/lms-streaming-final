package com.hust.lms.lms_core_streaming.queue.consumer;

import com.fasterxml.jackson.core.type.TypeReference;
import com.hust.lms.lms_core_streaming.config.RabbitConfig;
import com.hust.lms.lms_core_streaming.dto.VideoProcessingResultMessage;
import com.hust.lms.lms_core_streaming.queue.RabbitMQProducer;
import com.hust.lms.lms_core_streaming.service.RedisService;
import com.hust.lms.lms_core_streaming.service.StreamingService;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;
import com.hust.lms.lms_core_streaming.queue.message.VideoProcessingMessage;

@Component
@RequiredArgsConstructor
public class VideoConsumer {
  private final RedisService redisService;
  private final StreamingService streamingService;
  private final RabbitMQProducer producer;

  @RabbitListener(queues = RabbitConfig.SEND_STREAMING_QUEUE, concurrency = "3")
  public void consume(
      VideoProcessingMessage message,
      @Header(name = "amqp_messageId") String messageId
  ) {
    String key = String.format("MSG:%s", messageId);
    String value = this.redisService.getValue(key, new TypeReference<String>() {});
    if (value != null && value.equals("PROCESSED")) return;

    VideoProcessingResultMessage res = this.streamingService.handleEncode(message);
    this.producer.sendProcessingResult(res);

    this.redisService.setValue(key, "PROCESSED");
  }
}
