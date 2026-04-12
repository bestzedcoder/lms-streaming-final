package com.hust.lms.streaming.service;

public interface PathProvider {
  String getVideoPath(String teacherId, String fileName);
  String getResourcePath(String teacherId, String fileName);
  String sanitizeFileName(String fileName);
}
