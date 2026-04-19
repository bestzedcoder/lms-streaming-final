package com.hust.lms.streaming.configuration;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfiguration {
  public static final String MAIL_QUEUE = "mail.queue";
  public static final String SEND_STREAMING_QUEUE = "send.streaming.queue";
  public static final String RESULT_PROCESSING_QUEUE = "result.processing.queue";

  public static final String EXCHANGE = "lms.exchange";

  public static final String ROUTING_KEY_MAIL = "mail.routing.key";
  public static final String ROUTING_KEY_STREAMING = "streaming.routing.key";
  public static final String ROUTING_KEY_RESULT = "result.routing.key";

  // cấu hình 2 hàng đợi mail và video và result_process
  @Bean
  public Queue videoQueue() {
    return new Queue(SEND_STREAMING_QUEUE , false);
  }

  @Bean
  public Queue resultProcessingQueue() { return new Queue(RESULT_PROCESSING_QUEUE , false); }

  @Bean
  public Queue mailQueue() {
    return new Queue(MAIL_QUEUE , false);
  }

  // cấu hình điều hướng
  @Bean
  public DirectExchange exchange() {
    return new DirectExchange(EXCHANGE);
  }

  // cấu hình gắn queue vào exchange
  @Bean
  public Binding bindingMail() {
    return BindingBuilder.bind(mailQueue()).to(exchange()).with(ROUTING_KEY_MAIL);
  }

  @Bean
  public Binding bindingStream() {
    return BindingBuilder.bind(videoQueue()).to(exchange()).with(ROUTING_KEY_STREAMING);
  }

  @Bean
  public Binding bindingResultProcessing() {
    return BindingBuilder.bind(resultProcessingQueue()).to(exchange()).with(ROUTING_KEY_RESULT);
  }


  // serialization and deserialization
  @Bean
  public MessageConverter jsonMessageConverter() {
    return new Jackson2JsonMessageConverter();
  }

  @Bean
  public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
    RabbitTemplate template = new RabbitTemplate(connectionFactory);
    template.setMessageConverter(jsonMessageConverter());
    return template;
  }


}
