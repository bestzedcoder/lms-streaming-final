package com.hust.lms.lms_core_streaming.netty;

public interface HlsObjectService {

  /**
   * Lấy bytes của file HLS từ production bucket.
   */
  byte[] getObjectBytes(String ownerId, String videoId, String fileName);

  /**
   * Build object key đúng với format mà worker encode đang upload.
   */
  String buildObjectKey(String ownerId, String videoId, String fileName);

  /**
   * Content-Type theo phần mở rộng file.
   */
  String getContentType(String fileName);
}