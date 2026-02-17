package com.hust.lms.streaming.mapper;

import com.hust.lms.streaming.dto.response.category.CategoryPublicResponse;
import com.hust.lms.streaming.dto.response.instructor.InstructorCourseDetailsResponse;
import com.hust.lms.streaming.dto.response.instructor.InstructorCourseInfoResponse;
import com.hust.lms.streaming.dto.response.instructor.InstructorCourseResponse;
import com.hust.lms.streaming.dto.response.instructor.InstructorInfoResponse;
import com.hust.lms.streaming.dto.response.instructor.InstructorLessonResponse;
import com.hust.lms.streaming.dto.response.instructor.InstructorSectionResponse;
import com.hust.lms.streaming.model.Course;
import com.hust.lms.streaming.model.Enrollment;
import com.hust.lms.streaming.model.Instructor;
import com.hust.lms.streaming.model.Lesson;
import com.hust.lms.streaming.model.Section;
import java.math.BigDecimal;

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

  public static InstructorCourseResponse mapCourseToInstructorCourseResponse(Course course) {
    if (course == null) return null;

    InstructorCourseResponse response = new InstructorCourseResponse();
    response.setId(course.getId());
    response.setTitle(course.getTitle());
    response.setSlug(course.getSlug());
    response.setDescription(course.getDescription());
    response.setDescriptionShort(course.getDescriptionShort());
    response.setRequirements(course.getRequirements());
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

  public static InstructorCourseDetailsResponse mapCourseToInstructorCourseDetailsResponse(Course course) {
    if (course == null) return null;

    InstructorCourseDetailsResponse response = new InstructorCourseDetailsResponse();
    response.setCourse(InstructorMapper.mapCourseToInstructorCourseResponse(course));
    response.setSections(course.getSections().stream().map(InstructorMapper::mapSectionToInstructorSectionResponse).toList());
    return response;
  }

  public static InstructorSectionResponse mapSectionToInstructorSectionResponse(Section section) {
    if (section == null) return null;

    InstructorSectionResponse response = new InstructorSectionResponse();
    response.setId(section.getId());
    response.setTitle(section.getTitle());
    response.setCountLessons(section.getLessons().size());
    response.setDescriptionShort(section.getDescriptionShort());
    response.setLessons(section.getLessons().stream().map(InstructorMapper::mapLessonToInstructorLessonResponse).toList());
    return response;
  }

  public static InstructorLessonResponse mapLessonToInstructorLessonResponse(Lesson lesson) {
    if (lesson == null) return null;

    InstructorLessonResponse response = new InstructorLessonResponse();
    response.setId(lesson.getId());
    response.setTitle(lesson.getTitle());
    response.setPreview(lesson.getIsPreview());
    response.setLessonType(lesson.getLessonType());
    return response;
  }

  public static InstructorCourseInfoResponse mapCourseToInstructorCourseInfoResponse(Course course) {
    if (course == null) return null;

    InstructorCourseInfoResponse response = new InstructorCourseInfoResponse();
    response.setCourse(InstructorMapper.mapCourseToInstructorCourseResponse(course));
    response.setStudents(course.getEnrollments().stream().map(enrollment -> UserMapper.mapUserToUserPublicResponse(enrollment.getUser())).toList());
    response.setReviews(course.getReviews().stream().map(ReviewMapper::mapReviewToReviewCourseResponse).toList());
    response.setRevenue(course.getEnrollments().stream().map(Enrollment::getPricePaid).reduce(BigDecimal.ZERO, BigDecimal::add));
    return response;
  }
}
