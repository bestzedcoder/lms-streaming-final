package com.hust.lms.streaming.configuration;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.jsontype.impl.LaissezFaireSubTypeValidator;
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
  private String redisHost;
  @Value("${spring.data.redis.port}")
  private int redisPort;
  @Value("${spring.data.redis.password}")
  private String redisPassword;

  private final ObjectMapper objectMapper;

  // Tạo Connection Factory
  @Bean
  public LettuceConnectionFactory lettuceConnectionFactory() {
    RedisStandaloneConfiguration configuration = new RedisStandaloneConfiguration(redisHost, redisPort);
    configuration.setPassword(redisPassword);
    return new LettuceConnectionFactory(configuration);
  }

  // Tạo RedisTemplate
  @Bean
  public RedisTemplate<String, Object> redisTemplate() {
    RedisTemplate<String, Object> template = new RedisTemplate<>();
    template.setConnectionFactory(lettuceConnectionFactory());

    // Cấu hình mapper cho redis

    // Cấu hình key là String
    template.setKeySerializer(new StringRedisSerializer());
    template.setHashKeySerializer(new StringRedisSerializer());

    // Cấu hình value là JSON
    GenericJackson2JsonRedisSerializer genericJackson2JsonRedisSerializer = new GenericJackson2JsonRedisSerializer(this.objectMapper);
    template.setValueSerializer(genericJackson2JsonRedisSerializer);
    template.setHashValueSerializer(genericJackson2JsonRedisSerializer);

    template.afterPropertiesSet();

    return template;
  }
}
