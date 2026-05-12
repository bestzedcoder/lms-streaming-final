package com.hust.lms.streaming.dto.response.report;

import com.hust.lms.streaming.enums.RequestType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CourseRequestResponse {
    private UUID id;
    private String title;
    private RequestType type;
    private String report;
    private Boolean status;
    private UUID targetId;
}
