package com.hust.lms.lms_core_streaming.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
@RequiredArgsConstructor
public class RedisConfig {
  @Value("${spring.data.redis.host}")
  private String redisHost;
  @Value("${spring.data.redis.port}")
  private int redisPort;
  @Value("${spring.data.redis.password}")
  private String redisPassword;

  private final ObjectMapper objectMapper;

  @Bean
  public LettuceConnectionFactory lettuceConnectionFactory() {
    RedisStandaloneConfiguration configuration = new RedisStandaloneConfiguration(redisHost, redisPort);
    configuration.setPassword(redisPassword);
    return new LettuceConnectionFactory(configuration);
  }


  @Bean
  public RedisTemplate<String, Object> redisTemplate(LettuceConnectionFactory connectionFactory) {
    RedisTemplate<String, Object> template = new RedisTemplate<>();
    template.setConnectionFactory(connectionFactory);

    template.setKeySerializer(new StringRedisSerializer());
    template.setHashKeySerializer(new StringRedisSerializer());

    GenericJackson2JsonRedisSerializer serializer = new GenericJackson2JsonRedisSerializer(this.objectMapper);
    template.setValueSerializer(serializer);
    template.setHashValueSerializer(serializer);

    template.afterPropertiesSet();
    return template;
  }


}
