package com.hust.lms.streaming.service.impl;

import com.hust.lms.streaming.event.enums.ResourceType;
import com.hust.lms.streaming.exception.BadRequestException;
import com.hust.lms.streaming.service.FileValidationService;
import com.hust.lms.streaming.service.MalwareScannerService;
import com.hust.lms.streaming.service.S3StorageService;
import java.awt.image.BufferedImage;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Locale;
import java.util.Set;
import javax.imageio.ImageIO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@Slf4j
@RequiredArgsConstructor
public class FileValidationServiceImpl implements FileValidationService {

    @Value("${app.origin.dir}")
    private String BASE_DIR;

    @Value("${app.storage.s3.bucket-staging}")
    private String STAGING_BUCKET;

    private static final long MAX_IMAGE_SIZE = 5 * 1024 * 1024;

    private static final Set<String> IMAGE_EXTENSIONS = Set.of("jpg", "jpeg", "png");
    private static final Set<String> LECTURE_EXTENSIONS = Set.of("pdf", "txt");
    private static final Set<String> VIDEO_EXTENSIONS = Set.of("mp4");

    private static final Set<String> LECTURE_MIME = Set.of("application/pdf", "text/plain");
    private static final Set<String> VIDEO_MIME = Set.of("video/mp4", "application/mp4");

    private final S3StorageService s3StorageService;
    private final MalwareScannerService malwareScannerService;
    private final Tika tika;

    @Override
    public void validateImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File không được để trống.");
        }

        if (file.getSize() > MAX_IMAGE_SIZE) {
            throw new BadRequestException("Kích thước file tối đa là 5MB.");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isBlank()) {
            throw new BadRequestException("Tên file không hợp lệ.");
        }

        String ext = getExtension(originalFilename);
        if (!IMAGE_EXTENSIONS.contains(ext)) {
            throw new BadRequestException("Chỉ chấp nhận ảnh jpg, jpeg, png.");
        }

        try {
            byte[] bytes = file.getBytes();

            if (!validImageSignature(bytes, ext)) {
                throw new BadRequestException("File ảnh không đúng định dạng thực tế.");
            }

            BufferedImage image = ImageIO.read(file.getInputStream());
            if (image == null) {
                throw new BadRequestException("File ảnh không hợp lệ hoặc bị lỗi.");
            }

        } catch (BadRequestException e) {
            log.error("Lỗi file" , e);
            throw e;
        } catch (Exception e) {
            log.error("Lỗi file", e);
            throw new BadRequestException("Không thể đọc file ảnh.");
        }
    }

    @Override
    public void validateObjectFromMinio(String objectKey, ResourceType type) {
        Path workDir = null;

        try {
            Path root = Path.of(BASE_DIR);
            Files.createDirectories(root);

            workDir = Files.createTempDirectory(root, "validation-");
            Path tempFile = workDir.resolve("upload.bin");

            s3StorageService.download(objectKey, STAGING_BUCKET, tempFile);

            String ext = getExtension(objectKey);
            validateExtension(ext, type);

            String mime = tika.detect(tempFile);
            validateMime(mime, type);

            validateSignature(tempFile, ext, type);
            if (!malwareScannerService.isSafe(tempFile)) {
                throw new BadRequestException("File có dấu hiệu chứa mã độc.");
            }

            log.info("File validation passed objectKey={}, type={}, mime={}", objectKey, type, mime);

        } catch (BadRequestException e) {
            log.error("Lỗi file", e);
            throw e;
        } catch (Exception e) {
            log.error("Validate file failed objectKey={}, type={}", objectKey, type, e);
            throw new BadRequestException("File không hợp lệ hoặc không thể kiểm tra.");
        } finally {
            cleanupDirectory(workDir);
        }
    }

    private void validateExtension(String ext, ResourceType type) {
        boolean valid = switch (type) {
            case VIDEO -> VIDEO_EXTENSIONS.contains(ext);
            case LECTURE -> LECTURE_EXTENSIONS.contains(ext);
        };

        if (!valid) {
            throw new BadRequestException("Định dạng file không được hỗ trợ.");
        }
    }

    private void validateMime(String mime, ResourceType type) {
        boolean valid = switch (type) {
            case VIDEO -> VIDEO_MIME.contains(mime);
            case LECTURE -> LECTURE_MIME.contains(mime);
        };

        if (!valid) {
            throw new BadRequestException("MIME type không hợp lệ.");
        }
    }

    private void validateSignature(Path file, String ext, ResourceType type) throws Exception {
        boolean valid = switch (type) {
            case VIDEO -> ext.equals("mp4") && hasMp4Signature(file);
            case LECTURE -> switch (ext) {
                case "pdf" -> hasPdfSignature(file);
                case "txt" -> isPlainText(file);
                default -> false;
            };
        };

        if (!valid) {
            throw new BadRequestException("Nội dung file không khớp với định dạng.");
        }
    }

    private boolean hasPdfSignature(Path file) throws Exception {
        byte[] h = readFirstBytes(file, 5);
        return h.length >= 5
                && h[0] == 0x25
                && h[1] == 0x50
                && h[2] == 0x44
                && h[3] == 0x46
                && h[4] == 0x2D;
    }

    private boolean hasMp4Signature(Path file) throws Exception {
        byte[] h = readFirstBytes(file, 12);
        return h.length >= 12
                && h[4] == 'f'
                && h[5] == 't'
                && h[6] == 'y'
                && h[7] == 'p';
    }

    private boolean isPlainText(Path file) throws Exception {
        byte[] sample = readFirstBytes(file, 4096);

        for (byte b : sample) {
            int c = b & 0xff;
            if (c == 0) return false;
        }

        return true;
    }

    private boolean validImageSignature(byte[] bytes, String ext) {
        return switch (ext) {
            case "jpg", "jpeg" -> isJpeg(bytes);
            case "png" -> isPng(bytes);
            default -> false;
        };
    }

    private boolean isJpeg(byte[] b) {
        return b.length >= 3
                && (b[0] & 0xff) == 0xff
                && (b[1] & 0xff) == 0xd8
                && (b[2] & 0xff) == 0xff;
    }

    private boolean isPng(byte[] b) {
        return b.length >= 8
                && (b[0] & 0xff) == 0x89
                && b[1] == 0x50
                && b[2] == 0x4E
                && b[3] == 0x47
                && b[4] == 0x0D
                && b[5] == 0x0A
                && b[6] == 0x1A
                && b[7] == 0x0A;
    }

    private byte[] readFirstBytes(Path file, int length) throws Exception {
        try (InputStream inputStream = Files.newInputStream(file)) {
            return inputStream.readNBytes(length);
        }
    }

    private String getExtension(String filename) {
        if (filename == null || filename.isBlank()) return "";

        String cleanName = filename.toLowerCase(Locale.ROOT);
        int queryIndex = cleanName.indexOf('?');
        if (queryIndex >= 0) {
            cleanName = cleanName.substring(0, queryIndex);
        }

        int dotIndex = cleanName.lastIndexOf('.');
        if (dotIndex < 0 || dotIndex == cleanName.length() - 1) return "";

        return cleanName.substring(dotIndex + 1);
    }

    private void cleanupDirectory(Path dir) {
        if (dir == null) return;

        try (var paths = Files.walk(dir)) {
            paths.sorted(java.util.Comparator.reverseOrder())
                    .forEach(path -> {
                        try {
                            Files.deleteIfExists(path);
                        } catch (Exception e) {
                            log.warn("Cannot delete temp path={}", path, e);
                        }
                    });
        } catch (Exception e) {
            log.warn("Cannot cleanup temp dir={}", dir, e);
        }
    }
}