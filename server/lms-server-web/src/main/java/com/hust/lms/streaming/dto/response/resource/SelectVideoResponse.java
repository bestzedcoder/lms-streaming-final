package com.hust.lms.streaming.dto.response.resource;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SelectVideoResponse {
    private UUID videoId;
    private String title;
}
