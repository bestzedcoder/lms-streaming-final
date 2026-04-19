package com.hust.lms.streaming;

import static org.junit.jupiter.api.Assertions.*;

import com.fasterxml.jackson.core.type.TypeReference;
import com.hust.lms.streaming.dto.common.BaseListResponse;
import com.hust.lms.streaming.dto.common.BaseResponse;
import com.hust.lms.streaming.dto.response.user.UserResponse;
import com.hust.lms.streaming.redis.RedisService;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class RedisTest {

  @Autowired
  private RedisService redisService;

  private static final String KEY_BASE_RESPONSE = "test:redis:user:1";
  private static final String KEY_BASE_LIST_RESPONSE = "test:redis:user:list";
  private static final String KEY_EMPTY_LIST_RESPONSE = "test:redis:user:list:empty";
  private static final String KEY_NULL_LIST_RESPONSE = "test:redis:user:list:null";

  @AfterEach
  void cleanup() {
    redisService.deleteKey(KEY_BASE_RESPONSE);
    redisService.deleteKey(KEY_BASE_LIST_RESPONSE);
    redisService.deleteKey(KEY_EMPTY_LIST_RESPONSE);
    redisService.deleteKey(KEY_NULL_LIST_RESPONSE);
  }

  @Test
  void shouldSaveAndGetBaseResponse() {
    BaseResponse<UserResponse> res = new BaseResponse<>();
    res.setCode(200);
    res.setMessage("success");
    res.setData(
        UserResponse.builder()
            .email("test@gmail.com")
            .build()
    );
    res.setTimestamp(LocalDateTime.now());
    res.setSuccess(true);

    redisService.saveKeyAndValue(KEY_BASE_RESPONSE, res, 60, TimeUnit.SECONDS);

    BaseResponse<UserResponse> result = redisService.getValue(
        KEY_BASE_RESPONSE,
        new TypeReference<BaseResponse<UserResponse>>() {}
    );

    assertNotNull(result);
    assertEquals(200, result.getCode());
    assertEquals("success", result.getMessage());
    assertTrue(result.isSuccess());

    assertNotNull(result.getTimestamp());
    assertNotNull(result.getData());
    assertEquals("test@gmail.com", result.getData().getEmail());
  }

  @Test
  void shouldSaveAndGetBaseListResponse() {
    BaseListResponse<UserResponse> res = BaseListResponse.<UserResponse>builder()
        .code(200)
        .success(true)
        .message("success")
        .timestamp(LocalDateTime.now())
        .data(Arrays.asList(
            UserResponse.builder().email("a@gmail.com").build(),
            UserResponse.builder().email("b@gmail.com").build()
        ))
        .build();

    redisService.saveKeyAndValue(KEY_BASE_LIST_RESPONSE, res, 60, TimeUnit.SECONDS);

    BaseListResponse<UserResponse> result = redisService.getValue(
        KEY_BASE_LIST_RESPONSE,
        new TypeReference<BaseListResponse<UserResponse>>() {}
    );

    assertNotNull(result);
    assertEquals(200, result.getCode());
    assertEquals("success", result.getMessage());
    assertTrue(result.isSuccess());

    assertNotNull(result.getTimestamp());
    assertNotNull(result.getData());
    assertEquals(2, result.getData().size());
    assertEquals("a@gmail.com", result.getData().get(0).getEmail());
    assertEquals("b@gmail.com", result.getData().get(1).getEmail());
  }

  @Test
  void shouldHandleEmptyListResponse() {
    BaseListResponse<UserResponse> res = BaseListResponse.<UserResponse>builder()
        .code(200)
        .success(true)
        .message("empty")
        .timestamp(LocalDateTime.now())
        .data(Arrays.asList())
        .build();

    redisService.saveKeyAndValue(KEY_EMPTY_LIST_RESPONSE, res, 60, TimeUnit.SECONDS);

    BaseListResponse<UserResponse> result = redisService.getValue(
        KEY_EMPTY_LIST_RESPONSE,
        new TypeReference<BaseListResponse<UserResponse>>() {}
    );

    assertNotNull(result);
    assertEquals(200, result.getCode());
    assertEquals("empty", result.getMessage());
    assertTrue(result.isSuccess());

    assertNotNull(result.getTimestamp());
    assertNotNull(result.getData());
    assertEquals(0, result.getData().size());
  }

  @Test
  void shouldHandleNullListData() {
    BaseListResponse<UserResponse> res = BaseListResponse.<UserResponse>builder()
        .code(200)
        .success(true)
        .message("null data")
        .timestamp(LocalDateTime.now())
        .data(null)
        .build();

    redisService.saveKeyAndValue(KEY_NULL_LIST_RESPONSE, res, 60, TimeUnit.SECONDS);

    BaseListResponse<UserResponse> result = redisService.getValue(
        KEY_NULL_LIST_RESPONSE,
        new TypeReference<BaseListResponse<UserResponse>>() {}
    );

    assertNotNull(result);
    assertEquals(200, result.getCode());
    assertEquals("null data", result.getMessage());
    assertTrue(result.isSuccess());

    assertNotNull(result.getTimestamp());
    assertNull(result.getData());
  }
}