package com.hust.lms.streaming.mapper;

import com.hust.lms.streaming.dto.response.admin.AdminLecturePreview;
import com.hust.lms.streaming.dto.response.admin.AdminVideoPreview;
import com.hust.lms.streaming.dto.response.admin.CourseOfInstructorResponse;
import com.hust.lms.streaming.dto.response.admin.CoursePendingResponse;
import com.hust.lms.streaming.dto.response.admin.InstructorResponse;
import com.hust.lms.streaming.model.Course;
import com.hust.lms.streaming.model.Instructor;
import com.hust.lms.streaming.model.Resource;
import com.hust.lms.streaming.model.User;
import com.hust.lms.streaming.model.Video;

public class AdminMapper {
  private AdminMapper() {
    throw new AssertionError("Utility class");
  }

  public static CoursePendingResponse mapCourseToCoursePendingResponse(Course course) {
    CoursePendingResponse response = new CoursePendingResponse();
    response.setCourseId(course.getId());
    response.setTitle(course.getTitle());
    response.setDescription(course.getDescription());
    response.setThumbnail(course.getThumbnail());
    response.setNickname(course.getInstructor().getNickname());
    response.setInstructorPhone(course.getInstructor().getUser().getPhone());
    response.setInstructorEmail(course.getInstructor().getUser().getEmail());
    return response;
  }

  public static CourseOfInstructorResponse mapCourseToCourseOfInstructorResponse(Course course) {
    CourseOfInstructorResponse response = new CourseOfInstructorResponse();
    response.setCourseId(course.getId());
    response.setTitle(course.getTitle());
    response.setCategory(course.getCategory().getName());
    response.setStatus(course.getStatus());
    response.setSlug(course.getSlug());
    response.setTotalStudents(course.getEnrollments().size());
    return response;
  }

  public static InstructorResponse mapInstructorToInstructorResponse(Instructor instructor) {
    if (instructor == null) return null;

    InstructorResponse response = new InstructorResponse();
    response.setInstructorId(instructor.getId());
    response.setEmail(instructor.getUser().getEmail());
    response.setNickname(instructor.getNickname());
    response.setPhoneNumber(instructor.getUser().getPhone());
    response.setTotalCourses(instructor.getCourses().size());
    response.setTotalStudents(instructor.getTotalStudent());
    return response;
  }

  public static AdminLecturePreview mapResourceToAdminLecturePreview(Resource resource) {
    if (resource == null) return null;

    AdminLecturePreview response = new AdminLecturePreview();
    response.setLectureId(resource.getId());
    response.setTitle(resource.getTitle());
    response.setStatus(resource.getStatus());
    response.setOwner(resource.getOwner().getUser().getEmail());
    return response;
  }

  public static AdminVideoPreview mapVideoToAdminVideoPreview(Video video) {
    if (video == null) return null;

    AdminVideoPreview response = new AdminVideoPreview();
    response.setVideoId(video.getId());
    response.setTitle(video.getTitle());
    response.setStatus(video.getStatus());
    response.setOwner(video.getOwner().getUser().getEmail());
    return response;
  }
}
