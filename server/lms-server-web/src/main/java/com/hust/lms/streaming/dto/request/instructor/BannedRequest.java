package com.hust.lms.streaming.dto.request.instructor;

import com.hust.lms.streaming.dto.validation.NoHtml;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import org.hibernate.validator.constraints.UUID;

@Getter
public class BannedRequest {
  @NotBlank(message = "UserId không được để trống")
  @UUID(message = "UserId không đúng định dạng")
  private String userId;

  @NotBlank(message = "CourseId không được để trống")
  @UUID(message = "CourseId không đúng định dạng")
  private String courseId;

  @NoHtml
  @Size(max = 500, message = "Độ dài lý do không được quá 500")
  private String reason;
}
