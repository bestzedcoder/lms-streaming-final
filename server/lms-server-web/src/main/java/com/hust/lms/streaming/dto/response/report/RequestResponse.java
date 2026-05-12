package com.hust.lms.streaming.dto.response.report;

import com.hust.lms.streaming.enums.RequestType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RequestResponse {
    private String title;
    private String description;
    private Boolean status;
    private RequestType requestType;
    private LocalDateTime resolvedAt;
}
