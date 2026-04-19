package com.hust.lms.lms_core_streaming.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hust.lms.lms_core_streaming.service.RedisService;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class RedisServiceImpl implements RedisService {
  private final RedisTemplate<String, Object> redisTemplate;
  private final ObjectMapper objectMapper;

  @Override
  public <T> T getValue(String key, TypeReference<T> typeReference) {
    try {
      System.out.println(key);
      Object cachedObject = redisTemplate.opsForValue().get(key);

      if (cachedObject == null) {
        return null;
      }
      System.out.println(cachedObject);
      return objectMapper.convertValue(cachedObject, typeReference);
    } catch (IllegalArgumentException e) {
      log.error("Lỗi convert dữ liệu Redis cho key {}: {}", key, e.getMessage());
      return null;
    } catch (Exception e) {
      log.error("Lỗi không xác định khi lấy Redis key {}: {}", key, e.getMessage());
      return null;
    }
  }

  @Override
  public void setValue(String key, Object value) {
    try {
      redisTemplate.opsForValue().set(key, value, 10, TimeUnit.MINUTES);
      log.info("Saved key: {} with expiry: 10 minutes", key);
    } catch (Exception e) {
      log.error("Lỗi khi lưu Redis key {}: {}", key, e.getMessage());
    }
  }
}
