package com.hust.lms.streaming.mapper;

import com.hust.lms.streaming.dto.response.resource.InstructorLectureResponse;
import com.hust.lms.streaming.dto.response.resource.InstructorVideoResponse;
import com.hust.lms.streaming.model.Resource;
import com.hust.lms.streaming.model.Video;

public class ResourceMapper {
  private ResourceMapper() {
    throw new AssertionError("Utility class");
  }

  public static InstructorVideoResponse mapVideoToInstructorVideoResponse(Video video) {
    InstructorVideoResponse response = new InstructorVideoResponse();
    response.setId(video.getId());
    response.setTitle(video.getTitle());
    response.setThumbnail(video.getThumbnail());
    response.setDuration(video.getDuration());
    response.setSize(video.getSize());
    response.setStatus(video.getStatus());
    return response;
  }

  public static InstructorLectureResponse mapLectureToInstructorLectureResponse(
      Resource resource) {
    InstructorLectureResponse response = new InstructorLectureResponse();
    response.setId(resource.getId());
    response.setTitle(resource.getTitle());
    response.setSize(resource.getSize());
    response.setStatus(resource.getStatus());
    return response;
  }

}
