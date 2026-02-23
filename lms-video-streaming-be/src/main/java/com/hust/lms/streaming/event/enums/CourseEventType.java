package com.hust.lms.streaming.event.enums;

public enum CourseEventType {

  // ==========================================
  // 1. NHÓM SỰ KIỆN DỮ LIỆU & NỘI DUNG
  // ==========================================

  CREATED,              // Khóa học mới được tạo (Mặc định thường là PRIVATE/DRAFT)
  INFO_UPDATED,         // Thay đổi thông tin cơ bản (Tên, mô tả, giá, ảnh bìa...)
  CONTENT_UPDATED,      // Thay đổi cấu trúc bài học (Thêm/xóa chương, bài giảng, video)
  DELETED,              // Xóa hoàn toàn khóa học
  ADD_STUDENT,          // Thêm học viên
  ADD_REVIEW,           // Thêm đánh giá

  // ==========================================
  // 2. NHÓM SỰ KIỆN VÒNG ĐỜI & TRẠNG THÁI
  // ==========================================
  APPROVED_COURSE,     // Admin duyệt và cho phép phát hành (Trạng thái: PENDING -> PUBLISHED)

  PUBLISHED,            // Giảng viên tự phát hành (Nếu hệ thống cho phép không cần qua duyệt)
  MADE_PRIVATE,

  LOCKED,               // Admin khóa khóa học do vi phạm (Trạng thái: -> LOCKED)
  UNLOCKED              // Admin mở khóa sau khi xử lý xong vi phạm
}