package com.hust.lms.streaming.configuration;

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
public class RedisConfiguration {
  @Value("${spring.data.redis.host}")
  private String REDIS_HOST;
  @Value("${spring.data.redis.port}")
  private int REDIS_PORT;
  @Value("${spring.data.redis.password}")
  private String REDIS_PASSWORD;

  private final ObjectMapper objectMapper;

  // Tạo Connection Factory
  @Bean
  public LettuceConnectionFactory lettuceConnectionFactory() {
    RedisStandaloneConfiguration configuration = new RedisStandaloneConfiguration(REDIS_HOST, REDIS_PORT);
    configuration.setPassword(REDIS_PASSWORD);
    return new LettuceConnectionFactory(configuration);
  }

  // Tạo RedisTemplate
  @Bean
  public RedisTemplate<String, Object> redisTemplate() {
    RedisTemplate<String, Object> template = new RedisTemplate<>();
    template.setConnectionFactory(lettuceConnectionFactory());

    // serialize cho key
    template.setKeySerializer(new StringRedisSerializer());
    template.setHashKeySerializer(new StringRedisSerializer());

    // serialize cho value
    GenericJackson2JsonRedisSerializer genericJackson2JsonRedisSerializer = new GenericJackson2JsonRedisSerializer(this.objectMapper);
    template.setValueSerializer(genericJackson2JsonRedisSerializer);
    template.setHashValueSerializer(genericJackson2JsonRedisSerializer);

    template.afterPropertiesSet();

    return template;
  }
}
