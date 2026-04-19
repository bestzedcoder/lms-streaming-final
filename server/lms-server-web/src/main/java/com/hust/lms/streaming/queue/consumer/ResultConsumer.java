package com.hust.lms.streaming.queue.consumer;

import com.hust.lms.streaming.configuration.RabbitConfiguration;
import org.springframework.amqp.rabbit.annotation.RabbitListener;

public class ResultConsumer {

  @RabbitListener(queues = RabbitConfiguration.RESULT_PROCESSING_QUEUE, concurrency = "3")
  public void consume() {}
}
