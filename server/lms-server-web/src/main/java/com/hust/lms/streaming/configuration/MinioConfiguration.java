package com.hust.lms.streaming.configuration;

import io.minio.MinioAsyncClient;
import io.minio.MinioClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MinioConfiguration {

  @Value("${app.storage.s3.endpoint}")
  private String endpoint;
  @Value("${app.storage.s3.access-key}")
  private String accessKey;
  @Value("${app.storage.s3.secret-key}")
  private String secretKey;

  @Bean
  public MinioClient getMinioClient() {
    return MinioClient.builder()
        .endpoint(endpoint)
        .credentials(accessKey, secretKey)
        .build();
  }

  @Bean
  public MinioAsyncClient minioAsyncClient() {
    return MinioAsyncClient.builder()
        .endpoint(endpoint)
        .credentials(accessKey, secretKey)
        .build();
  }

  @Bean
  public CustomMinioClient customMinioClient(MinioAsyncClient minioAsyncClient) {
    return new CustomMinioClient(minioAsyncClient);
  }

}
