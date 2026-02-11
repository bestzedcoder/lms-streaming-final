package com.hust.lms.streaming.mapper;

import com.hust.lms.streaming.dto.response.category.CategoryPublicResponse;
import com.hust.lms.streaming.dto.response.instructor.InstructorCourseResponse;
import com.hust.lms.streaming.dto.response.instructor.InstructorInfoResponse;
import com.hust.lms.streaming.model.Course;
import com.hust.lms.streaming.model.Instructor;

public class InstructorMapper {
  private InstructorMapper() {
    throw new AssertionError("Utility class");
  }

  public static InstructorInfoResponse mapInstructorToInstructorInfoResponse(Instructor instructor) {
    if (instructor == null) return null;

    InstructorInfoResponse response = new InstructorInfoResponse();
    response.setTitle(instructor.getTitle());
    response.setBio(instructor.getBio());
    response.setTotalCourses(instructor.getCourses().size());
    response.setTotalStudents(instructor.getTotalStudent());
    response.setCreatedAt(instructor.getCreatedAt());
    response.setUpdatedAt(instructor.getUpdatedAt());
    return response;
  }

  public static InstructorCourseResponse mapInstructorToInstructorCourseResponse(Course course) {
    if (course == null) return null;

    InstructorCourseResponse response = new InstructorCourseResponse();
    response.setId(course.getId());
    response.setTitle(course.getTitle());
    response.setSlug(course.getSlug());
    response.setDescription(course.getDescription());
    response.setPrice(course.getPrice());
    response.setSalePrice(course.getSalePrice());
    response.setThumbnail(course.getThumbnail());
    response.setLevel(course.getLevel());
    response.setStatus(course.getStatus());
    response.setAverageRating(course.getAverageRating());
    response.setCountRating(course.getCountRating());
    response.setTotalSections(course.getSections().size());
    response.setTotalLessons(course.getSections().stream().map(section -> section.getLessons().size()).reduce(0, Integer::sum));
    response.setTotalStudents(course.getEnrollments().size());
    response.setCreatedAt(course.getCreatedAt());
    response.setUpdatedAt(course.getUpdatedAt());
    response.setUpdatedBy(course.getUpdatedBy());
    response.setCreatedBy(course.getCreatedBy());
    CategoryPublicResponse category = CategoryPublicResponse.builder()
        .id(course.getCategory().getId())
        .name(course.getCategory().getName())
        .slug(course.getCategory().getSlug())
        .build();
    response.setCategory(category);
    return response;
  }
}
