package com.hust.lms.streaming.mapper;

import com.hust.lms.streaming.dto.response.report.InstructorRequestResponse;
import com.hust.lms.streaming.model.Request;

public class RequestMapper {
  private RequestMapper() {
    throw new AssertionError("Utility class");
  }

  public static InstructorRequestResponse mapRequestToInstructorRequestResponse(Request request) {
    InstructorRequestResponse response = new InstructorRequestResponse();
    response.setId(request.getId());
    response.setTitle(request.getTitle());
    response.setDescription(request.getDescription());
    response.setStatus(request.getStatus());
    response.setType(request.getRequestType());
    response.setUser(UserMapper.mapUserToUserPublicResponse(request.getUser()));
    return response;
  }
}
