package com.hust.lms.streaming.configuration;

import io.minio.CreateMultipartUploadResponse;
import io.minio.MinioAsyncClient;
import io.minio.ObjectWriteResponse;
import io.minio.errors.InsufficientDataException;
import io.minio.errors.InternalException;
import io.minio.errors.XmlParserException;
import io.minio.messages.Part;
import com.google.common.collect.Multimap;
import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.concurrent.CompletableFuture;

public class CustomMinioClient extends MinioAsyncClient {
  public CustomMinioClient(MinioAsyncClient client) {
    super(client);
  }

  public CompletableFuture<CreateMultipartUploadResponse> createMultipartUploadPublic(
      String bucket, String region, String object, Multimap<String, String> headers, Multimap<String, String> extraQueryParams)
      throws InsufficientDataException, IOException, NoSuchAlgorithmException, InvalidKeyException, XmlParserException, InternalException {
    return this.createMultipartUploadAsync(bucket, region, object, headers, extraQueryParams);
  }

  public CompletableFuture<ObjectWriteResponse> completeMultipartUploadPublic(
      String bucket, String region, String object, String uploadId, Part[] parts, Multimap<String, String> extraHeaders, Multimap<String, String> extraQueryParams)
      throws InsufficientDataException, IOException, NoSuchAlgorithmException, InvalidKeyException, XmlParserException, InternalException {
    return this.completeMultipartUploadAsync(bucket, region, object, uploadId, parts, extraHeaders, extraQueryParams);
  }
}