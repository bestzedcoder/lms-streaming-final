package com.hust.lms.streaming.upload;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.hust.lms.streaming.exception.BadRequestException;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.Arrays;
import java.util.UUID;
import javax.imageio.ImageIO;
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

  private static final String[] ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp"};

  private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;

  @Override
  public CloudinaryUploadResult uploadImage(MultipartFile file, String folder) {

    this.validateImage(file);

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

  private void validateImage(MultipartFile file) {
    if (file.isEmpty()) {
      throw new BadRequestException("File không được để trống.");
    }

    if (file.getSize() > MAX_FILE_SIZE) {
      throw new BadRequestException("Kích thước file tối đa là 5MB.");
    }

    String originalFilename = file.getOriginalFilename();
    if (originalFilename == null) throw new BadRequestException("Tên file không hợp lệ.");

    String extension = getExtension(originalFilename);
    boolean isAllowed = Arrays.asList(ALLOWED_EXTENSIONS).contains(extension.toLowerCase());
    if (!isAllowed) {
      throw new BadRequestException("Chỉ chấp nhận định dạng: jpg, jpeg, png, webp.");
    }

    try {
      BufferedImage bi = ImageIO.read(file.getInputStream());
      if (bi == null) {
        throw new BadRequestException("File không hợp lệ hoặc bị lỗi.");
      }
    } catch (IOException e) {
      throw new BadRequestException("Lỗi khi đọc file ảnh.");
    }

    String contentType = file.getContentType();
    if (contentType == null || !contentType.startsWith("image/")) {
      throw new BadRequestException("Content-Type không hợp lệ.");
    }
  }

  private String getExtension(String filename) {
    int lastDotIndex = filename.lastIndexOf(".");
    if (lastDotIndex == -1) return "";
    return filename.substring(lastDotIndex + 1);
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
