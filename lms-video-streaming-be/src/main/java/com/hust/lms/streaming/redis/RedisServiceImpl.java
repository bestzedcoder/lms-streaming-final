package com.hust.lms.streaming.redis;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Set;
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
  public <T> void saveKeyAndValue(String key, T value, long timeout, TimeUnit timeUnit) {
    try {
      redisTemplate.opsForValue().set(key, value, timeout, timeUnit);
      log.info("Saved key: {} with expiry: {} {}", key, timeout, timeUnit);
    } catch (Exception e) {
      log.error("Lỗi khi lưu Redis key {}: {}", key, e.getMessage());
    }
  }

  @Override
  public <T> T getValue(String key, TypeReference<T> typeReference) {
    try {
      Object cachedObject = redisTemplate.opsForValue().get(key);

      if (cachedObject == null) {
        return null;
      }

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
  public void deleteKey(String key) {
    redisTemplate.delete(key);
    log.info("Deleted key: {}", key);
  }

  @Override
  public void deleteByPattern(String pattern) {
    Set<String> keys = redisTemplate.keys(pattern);
    if (!keys.isEmpty()) {
      redisTemplate.delete(keys);
      log.info("Deleted {} keys matching pattern: {}", keys.size(), pattern);
    }
  }

  @Override
  public void clear() {
    try {
      redisTemplate.getConnectionFactory().getConnection().flushDb();
      log.warn("Redis Database cleared!");
    } catch (Exception e) {
      log.error("Failed to clear Redis: {}", e.getMessage());
    }
  }
}
