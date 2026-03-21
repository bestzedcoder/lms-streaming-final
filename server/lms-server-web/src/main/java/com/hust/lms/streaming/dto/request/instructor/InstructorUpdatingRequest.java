package com.hust.lms.streaming.dto.request.instructor;


import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.hust.lms.streaming.dto.validation.NoHtml;
import com.hust.lms.streaming.dto.validation.XssSanitizerDeserializer;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class InstructorUpdatingRequest {

  @Size(min = 4, max = 20, message = "Biệt danh không thể ngắn quá 4 ký tự và không dài quá 20 ký tự")
  @NoHtml(message = "Chức danh chứa ký tự không hợp lệ")
  private String nickname;

  @Size(max = 100, message = "Chức danh không được vượt quá 100 ký tự")
  @NoHtml(message = "Chức danh chứa ký tự không hợp lệ")
  private String jobTitle;

  @Size(max = 5000, message = "Tiểu sử không được vượt quá 5000 ký tự")
  @JsonDeserialize(using = XssSanitizerDeserializer.class)
  private String bio;

}
