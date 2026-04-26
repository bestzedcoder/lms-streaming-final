package com.hust.lms.streaming.configuration;

import io.minio.MinioAsyncClient;
import io.minio.MinioClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MinioConfiguration {

  @Value("${app.storage.s3.endpoint}")
  private String ENDPOINT;
  @Value("${app.storage.s3.access-key}")
  private String ACCESS_KEY;
  @Value("${app.storage.s3.secret-key}")
  private String SECRET_KEY;

  @Bean
  public MinioClient getMinioClient() {
    return MinioClient.builder()
        .endpoint(ENDPOINT)
        .credentials(ACCESS_KEY, SECRET_KEY)
        .build();
  }

  @Bean
  public MinioAsyncClient minioAsyncClient() {
    return MinioAsyncClient.builder()
        .endpoint(ENDPOINT)
        .credentials(ACCESS_KEY, SECRET_KEY)
        .build();
  }

  @Bean
  public CustomMinioClient customMinioClient(MinioAsyncClient minioAsyncClient) {
    return new CustomMinioClient(minioAsyncClient);
  }

}
