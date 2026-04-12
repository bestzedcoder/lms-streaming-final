package com.hust.lms.streaming.service.impl;

import com.hust.lms.streaming.service.PathProvider;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class PathProviderImpl implements PathProvider {

  @Override
  public String getVideoPath(String teacherId, String fileName) {
    String cleanName = sanitizeFileName(fileName);
    return String.format("%s/videos/%s_%s", teacherId, UUID.randomUUID(), cleanName);
  }

  @Override
  public String getResourcePath(String teacherId, String fileName) {
    String cleanName = sanitizeFileName(fileName);
    return String.format("%s/resources/%s_%s", teacherId, UUID.randomUUID(), cleanName);
  }

  @Override
  public String sanitizeFileName(String fileName) {
    return fileName.replaceAll("[^a-zA-Z0-9.-]", "_");
  }
}
