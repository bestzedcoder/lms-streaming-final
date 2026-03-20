package com.hust.lms.streaming.redis;

import com.fasterxml.jackson.core.type.TypeReference;
import java.util.concurrent.TimeUnit;

public interface RedisService {
  <T> void saveKeyAndValue(String key, T value, long timeout, TimeUnit timeUnit);
  <T> T getValue(String key, TypeReference<T> typeReference);
  void deleteKey(String key);
  void deleteByPattern(String pattern);
  void clear();
}
