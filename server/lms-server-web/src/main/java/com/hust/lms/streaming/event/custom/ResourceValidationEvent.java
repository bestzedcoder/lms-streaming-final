package com.hust.lms.streaming.event.custom;


import com.hust.lms.streaming.event.enums.ResourceType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResourceValidationEvent {
    private ResourceType type;
    private UUID resourceId;
    private String originalUrl;
}
