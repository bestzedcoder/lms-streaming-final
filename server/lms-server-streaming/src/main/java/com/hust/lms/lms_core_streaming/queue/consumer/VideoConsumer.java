package queue.consumer;

import config.RabbitConfig;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;
import queue.message.VideoProcessingMessage;

@Component
public class VideoConsumer {

  @RabbitListener(queues = RabbitConfig.SEND_STREAMING_QUEUE, concurrency = "3")
  public void consume(
      VideoProcessingMessage message,
      @Header(name = "messageId") String messageId
  ) {
    System.out.println(messageId);
    System.out.println(message);
  }
}
