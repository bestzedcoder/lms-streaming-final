package com.hust.lms.lms_core_streaming.service.impl;

import com.hust.lms.lms_core_streaming.service.HlsObjectService;
import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Service này chạy ở streaming server.
 *
 * Nhiệm vụ:
 * - đọc file HLS đã xử lý từ production bucket
 * - không còn phụ thuộc ownerId/videoId
 * - chỉ cần objectKey thật trong MinIO
 */
@Service
@RequiredArgsConstructor
public class HlsObjectServiceImpl implements HlsObjectService {

  @Value("${app.storage.s3.bucket-production}")
  private String productionBucket;

  private final MinioClient minioClient;

  @Override
  public byte[] getObjectBytesByKey(String objectKey) {
    try (InputStream inputStream = minioClient.getObject(
            GetObjectArgs.builder()
                    .bucket(productionBucket)
                    .object(objectKey)
                    .build());
         ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

      inputStream.transferTo(outputStream);
      return outputStream.toByteArray();

    } catch (Exception e) {
      throw new RuntimeException("Cannot load HLS object: " + objectKey, e);
    }
  }

  @Override
  public String getContentType(String fileName) {
    String lower = fileName.toLowerCase();

    if (lower.endsWith(".m3u8")) {
      return "application/vnd.apple.mpegurl";
    }
    if (lower.endsWith(".ts")) {
      return "video/mp2t";
    }
    if (lower.endsWith(".m4s")) {
      return "video/iso.segment";
    }

    return "application/octet-stream";
  }
}