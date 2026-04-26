package com.hust.lms.streaming.service;

import com.hust.lms.streaming.event.enums.ResourceType;
import org.springframework.web.multipart.MultipartFile;

public interface FileValidationService {
    void validateImage(MultipartFile file);
    void validateObjectFromMinio(String objectKey, ResourceType type);
}
