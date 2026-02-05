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
  public static final String VIDEO_QUEUE = "video.queue";
  public static final String MAIL_QUEUE = "mail.queue";

  public static final String EXCHANGE = "lms.exchange";

  public static final String ROUTING_KEY_MAIL = "mail.routing.key";
  public static final String ROUTING_KEY_VIDEO = "video.routing.key";

  // cấu hình 2 hàng đợi mail và video
  @Bean
  public Queue videoQueue() {
    return new Queue(VIDEO_QUEUE , true);
  }

  @Bean
  public Queue mailQueue() {
    return new Queue(MAIL_QUEUE , true);
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
  public Binding bindingVideo() {
    return BindingBuilder.bind(videoQueue()).to(exchange()).with(ROUTING_KEY_VIDEO);
  }

  // cấu hình convert DTO -> JSON
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
