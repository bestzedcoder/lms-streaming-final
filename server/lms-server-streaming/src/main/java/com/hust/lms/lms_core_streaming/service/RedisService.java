package com.hust.lms.lms_core_streaming.service;

import com.fasterxml.jackson.core.type.TypeReference;

public interface RedisService {
  <T> T getValue(String key, TypeReference<T> typeReference);
  void setValue(String key, Object value);
}
