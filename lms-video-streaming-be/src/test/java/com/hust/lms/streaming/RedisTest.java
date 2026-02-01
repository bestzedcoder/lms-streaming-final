package com.hust.lms.streaming;

import com.fasterxml.jackson.core.type.TypeReference;
import com.hust.lms.streaming.dto.common.BaseResponse;
import com.hust.lms.streaming.dto.response.user.UserResponse;
import com.hust.lms.streaming.redis.RedisService;
import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class RedisTest {
  @Autowired
  private RedisService redisService;

  @Test
  void redisTest() {
    String key = "test:redis:user:1";

    BaseResponse<UserResponse> res = new BaseResponse<>();
    res.setCode(200);
    res.setMessage("success");
    res.setData(UserResponse.builder().uuid("Hello").email("test@gmail.com").build());
    res.setTimestamp(LocalDateTime.now());
    res.setSuccess(true);

    this.redisService.saveKeyAndValue(key, res , 60 , TimeUnit.SECONDS);

    BaseResponse<UserResponse> result = this.redisService.getValue(key,
        new TypeReference<BaseResponse<UserResponse>>() {});
    System.out.println(result);
  }
}
