package com.hust.lms.streaming.mail;

public interface MailService {
  /**
   * 1. Gửi thông tin tài khoản mới (khi Admin tạo user).
   * Bao gồm: Email đăng nhập và Mật khẩu ngẫu nhiên.
   */
  void sendNewAccountCredentials(String toEmail, String rawPassword);

  /**
   * 2. Gửi mã xác thực để kích hoạt tài khoản (khi User tự đăng ký).
   * Bao gồm: Mã OTP hoặc Link kích hoạt.
   */
  void sendAccountActivationCode(String toEmail, String otpCode);

  /**
   * 3. Gửi mã xác thực cho yêu cầu Quên mật khẩu.
   * Bao gồm: Mã OTP để user nhập vào form reset pass.
   */
  void sendPasswordResetCode(String toEmail, String otpCode);

  /**
   * 4. Gửi mật khẩu mới (Sau khi user đã xác thực OTP thành công).
   * Trường hợp hệ thống tự sinh pass mới gửi về mail thay vì user tự nhập.
   */
  void sendNewPassword(String toEmail, String newPassword);

}
