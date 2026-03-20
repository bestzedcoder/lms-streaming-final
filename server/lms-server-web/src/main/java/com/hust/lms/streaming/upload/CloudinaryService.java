package com.hust.lms.streaming.upload;

import org.springframework.web.multipart.MultipartFile;

public interface CloudinaryService {
  CloudinaryUploadResult uploadImage(MultipartFile file, String folder);
  void deleteImage(String publicId);
}
