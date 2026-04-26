package com.hust.lms.lms_core_streaming.service;

public interface HlsObjectService {

  /**
   * Đọc file HLS từ production bucket theo object key thật.
   *
   * Ví dụ objectKey:
   * ownerId/videos/videoId/hls/master.m3u8
   */
  byte[] getObjectBytesByKey(String objectKey);

  /**
   * Content-Type theo phần mở rộng file.
   */
  String getContentType(String fileName);
}