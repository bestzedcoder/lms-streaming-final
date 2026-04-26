package com.hust.lms.streaming.upload;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.hust.lms.streaming.exception.BadRequestException;
import java.io.IOException;
import java.util.UUID;

import com.hust.lms.streaming.service.FileValidationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@Slf4j
@RequiredArgsConstructor
public class CloudinaryServiceImpl implements CloudinaryService {
  private final Cloudinary cloudinary;
  private final FileValidationService fileValidationService;

  @Override
  public CloudinaryUploadResult uploadImage(MultipartFile file, String folder) {

    this.fileValidationService.validateImage(file);

    try {
      var uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
          "folder", "lms_streaming/"+folder,
          "public_id", UUID.randomUUID().toString(),
          "resource_type", "image"
      ));

      log.info("Uploaded image successfully: {}", uploadResult.get("secure_url").toString());

      return CloudinaryUploadResult.builder()
          .url(uploadResult.get("secure_url").toString())
          .publicId(uploadResult.get("public_id").toString())
          .build();

    } catch (IOException e) {
      log.error("Lỗi upload ảnh lên Cloudinary: {}", e.getMessage());
      throw new BadRequestException("Không thể upload ảnh, vui lòng thử lại sau.");
    }
  }


  @Override
  @Async
  public void deleteImage(String publicId) {
    try {
      if (publicId != null) {
        cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("resource_type", "image"));
        log.info("Đã xóa ảnh trên Cloudinary: {}", publicId);
      }
    } catch (IOException e) {
      log.error("Lỗi xóa ảnh Cloudinary: {}", e.getMessage());
    }
  }
}
