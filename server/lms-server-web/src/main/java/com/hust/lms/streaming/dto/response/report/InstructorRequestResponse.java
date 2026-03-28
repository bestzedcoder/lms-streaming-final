package com.hust.lms.streaming.dto.response.report;

import com.hust.lms.streaming.dto.response.user.UserPublicResponse;
import com.hust.lms.streaming.enums.RequestType;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InstructorRequestResponse {
  private UUID id;
  private String title;
  private String description;
  private RequestType type;
  private Boolean status;
  private UserPublicResponse user;
}
