package com.hust.lms.streaming.dto.response.resource;


import com.hust.lms.streaming.enums.ResourceStatus;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InstructorLectureResponse {
  private UUID id;
  private String title;
  private ResourceStatus status;
  private Long size;
}
