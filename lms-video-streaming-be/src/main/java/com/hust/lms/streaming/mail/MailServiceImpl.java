package com.hust.lms.streaming.mail;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class MailServiceImpl implements MailService {

  private final JavaMailSender mailSender;
  private final TemplateEngine templateEngine;

  @Override
  public void sendNewAccountCredentials(String toEmail, String rawPassword) {
    Map<String, Object> variables = new HashMap<>();
    variables.put("email", toEmail);
    variables.put("password", rawPassword);
    variables.put("name", extractNameFromEmail(toEmail));

    sendHtmlEmail(toEmail, "Thông tin tài khoản mới - LMS Streaming", "new-account", variables);
  }

  @Override
  public void sendAccountActivationCode(String toEmail, String otpCode) {
    Map<String, Object> variables = new HashMap<>();
    variables.put("name", extractNameFromEmail(toEmail));
    variables.put("otpCode", otpCode);

    sendHtmlEmail(toEmail, "Mã xác thực kích hoạt tài khoản", "otp-active-account", variables);
  }

  @Override
  public void sendPasswordResetCode(String toEmail, String otpCode) {
    Map<String, Object> variables = new HashMap<>();
    variables.put("email", toEmail);
    variables.put("otpCode", otpCode);

    sendHtmlEmail(toEmail, "Yêu cầu đặt lại mật khẩu", "forgot-password", variables);
  }

  @Override
  public void sendNewPassword(String toEmail, String newPassword) {
    Map<String, Object> variables = new HashMap<>();
    variables.put("email", toEmail);
    variables.put("newPassword", newPassword);

    sendHtmlEmail(toEmail, "Cấp lại mật khẩu thành công", "reset-password", variables);
  }

  private void sendHtmlEmail(String to, String subject, String templateName, Map<String, Object> variables) {
    try {
      Context context = new Context();
      context.setVariables(variables);

      String htmlBody = templateEngine.process(templateName, context);

      MimeMessage message = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

      helper.setTo(to);
      helper.setSubject(subject);
      helper.setText(htmlBody, true);

      mailSender.send(message);
      log.info("Email sent successfully to: {} | Subject: {}", to, subject);

    } catch (MessagingException e) {
      log.error("Failed to send email to: {} | Error: {}", to, e.getMessage());
    } catch (Exception e) {
      log.error("Unexpected error sending email: {}", e.getMessage());
    }
  }

  private String extractNameFromEmail(String email) {
    if (email == null || !email.contains("@")) return "Học viên";
    return email.split("@")[0];
  }
}