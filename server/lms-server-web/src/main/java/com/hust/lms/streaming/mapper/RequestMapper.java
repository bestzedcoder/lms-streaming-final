package com.hust.lms.streaming.mapper;

import com.hust.lms.streaming.dto.response.report.CourseRequestResponse;
import com.hust.lms.streaming.dto.response.report.InstructorRequestResponse;
import com.hust.lms.streaming.dto.response.report.RequestResponse;
import com.hust.lms.streaming.model.Request;

public class RequestMapper {
  private RequestMapper() {
    throw new AssertionError("Utility class");
  }

  public static InstructorRequestResponse mapRequestToInstructorRequestResponse(Request request) {
    if (request == null) return null;

    InstructorRequestResponse response = new InstructorRequestResponse();
    response.setId(request.getId());
    response.setTitle(request.getTitle());
    response.setDescription(request.getDescription());
    response.setStatus(request.getStatus());
    response.setType(request.getRequestType());
    response.setUser(UserMapper.mapUserToUserPublicResponse(request.getUser()));
    return response;
  }

  public static CourseRequestResponse mapRequestToCourseRequestResponse(Request request) {
    if (request == null) return null;

    CourseRequestResponse response = new CourseRequestResponse();
    response.setId(request.getId());
    response.setTitle(request.getTitle());
    response.setReport(request.getDescription());
    response.setType(request.getRequestType());
    response.setTargetId(request.getTargetId());
    response.setStatus(request.getStatus());
    return response;
  }

  public static RequestResponse mapRequestToRequestResponse(Request request) {
    if (request == null) return null;

    RequestResponse response = new RequestResponse();
    response.setRequestType(request.getRequestType());
    response.setTitle(request.getTitle());
    response.setDescription(request.getDescription());
    response.setStatus(request.getStatus());
    response.setResolvedAt(request.getResolvedAt());
    return response;
  }
}
