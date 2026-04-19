package config;

import lombok.RequiredArgsConstructor;
import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class RabbitConfig {
  private static final String EXCHANGE = "lms.exchange";

  public static final String SEND_STREAMING_QUEUE = "send.streaming.queue";
  public static final String RESULT_PROCESSING_QUEUE = "result.processing.queue";

  public static final String ROUTING_KEY_STREAMING = "streaming.routing.key";
  public static final String ROUTING_KEY_RESULT = "result.routing.key";



  @Bean
  public Queue sendStreamingQueue() {
    return new Queue(RabbitConfig.SEND_STREAMING_QUEUE, false);
  }

  @Bean
  public Queue resultProcessingQueue() {
    return new Queue(RabbitConfig.RESULT_PROCESSING_QUEUE, false);
  }


  @Bean
  public DirectExchange exchange() {
    return new DirectExchange(RabbitConfig.EXCHANGE);
  }


  @Bean
  public Binding streamingBinding() {
    return BindingBuilder.bind(sendStreamingQueue()).to(exchange()).with(RabbitConfig.ROUTING_KEY_STREAMING);
  }

  @Bean
  public Binding resultProcessingBinding() {
    return BindingBuilder.bind(resultProcessingQueue()).to(exchange()).with(RabbitConfig.ROUTING_KEY_RESULT);
  }

  // serialization and deserialization
  @Bean
  public MessageConverter jsonMessageConverter() {
    return new Jackson2JsonMessageConverter();
  }

  @Bean
  public ConnectionFactory connectionFactory(
      @Value("${spring.rabbitmq.host}") String host,
      @Value("${spring.rabbitmq.port}") int port,
      @Value("${spring.rabbitmq.username}") String username,
      @Value("${spring.rabbitmq.password}") String password
  ) {
    CachingConnectionFactory factory = new CachingConnectionFactory();
    factory.setHost(host);
    factory.setPort(port);
    factory.setUsername(username);
    factory.setPassword(password);
    return factory;
  }

  @Bean
  public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
    RabbitTemplate template = new RabbitTemplate(connectionFactory);
    template.setMessageConverter(jsonMessageConverter());
    return template;
  }



}
