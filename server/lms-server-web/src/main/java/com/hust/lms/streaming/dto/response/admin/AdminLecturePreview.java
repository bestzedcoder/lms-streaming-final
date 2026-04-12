package com.hust.lms.streaming.dto.response.admin;

import com.hust.lms.streaming.enums.ResourceStatus;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdminLecturePreview {
  private UUID lectureId;
  private String title;
  private ResourceStatus status;
  private String owner;
}
