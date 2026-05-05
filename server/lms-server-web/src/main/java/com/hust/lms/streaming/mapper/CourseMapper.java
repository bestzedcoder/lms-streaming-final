package com.hust.lms.streaming.mapper;

import com.hust.lms.streaming.dto.response.category.CategoryPublicResponse;
import com.hust.lms.streaming.dto.response.course.*;
import com.hust.lms.streaming.dto.response.instructor.*;
import com.hust.lms.streaming.enums.EnrollmentStatus;
import com.hust.lms.streaming.model.Course;
import com.hust.lms.streaming.model.Lesson;
import com.hust.lms.streaming.model.Section;
import com.hust.lms.streaming.model.User;

import java.time.LocalDateTime;

public class CourseMapper {
  private CourseMapper() {
    throw new AssertionError("Utility class");
  }

  public static CourseAuthDetailsResponse mapCourseToCourseAuthDetailsResponse(Course course, Boolean hasAccess, EnrollmentStatus status) {
    CourseAuthDetailsResponse response = new CourseAuthDetailsResponse();
    response.setCourse(CourseMapper.mapCourseToCoursePublicDetailsResponse(course));
    response.setStatus(status);
    response.setHasAccess(hasAccess);
    return response;
  }

  public static CoursePublicDetailsResponse mapCourseToCoursePublicDetailsResponse(Course course) {
    if (course == null) return null;

    CoursePublicDetailsResponse response = new CoursePublicDetailsResponse();
    response.setTitle(course.getTitle());
    response.setSlug(course.getSlug());
    response.setDescription(course.getDescription());
    response.setDescriptionShort(course.getDescriptionShort());
    response.setRequirements(course.getRequirements());
    response.setLevel(course.getLevel());
    response.setAverageRating(course.getAverageRating());
    response.setCountRating(course.getCountRating());
    response.setTotalStudents(course.getEnrollments().size());
    response.setThumbnail(course.getThumbnail());
    response.setTotalSections(course.getSections().size());
    response.setTotalLessons(course.getSections().stream().map(section -> section.getLessons().size()).reduce(0, Integer::sum));
    response.setUpdatedAt(course.getUpdatedAt());
    response.setSections(course.getSections().stream().map(CourseMapper::mapSectionToSectionPublicResponse).toList());
    response.setReviews(course.getReviews().stream().map(ReviewMapper::mapReviewToReviewPublicResponse).toList());
    response.setInstructor(InstructorMapper.mapInstructorToInstructorPublicResponse(course.getInstructor()));
    return response;
  }

  public static CoursePublicRegistrationResponse mapCourseToCoursePublicRegistrationResponse(Course course) {
    if (course == null) return null;

    CoursePublicRegistrationResponse response = new CoursePublicRegistrationResponse();
    response.setTitle(course.getTitle());
    response.setStatus(course.getStatus());
    response.setThumbnail(course.getThumbnail());
    return response;
  }

  public static SectionPublicResponse mapSectionToSectionPublicResponse(Section section) {
    if (section == null) return null;

    SectionPublicResponse response = new SectionPublicResponse();
    response.setTitle(section.getTitle());
    response.setDescriptionShort(section.getDescriptionShort());
    response.setLessons(section.getLessons().stream().filter(Lesson::getPreview).map(CourseMapper::mapLessonToLessonPublicResponse).toList());
    return response;
  }

  public static LessonPublicResponse mapLessonToLessonPublicResponse(Lesson lesson) {
    if (lesson == null) return null;

    LessonPublicResponse response = new LessonPublicResponse();
    response.setTitle(lesson.getTitle());
    response.setLessonType(lesson.getLessonType());
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
        .name(course.getCategory().getName())
        .slug(course.getCategory().getSlug())
        .build();
    response.setCategory(category);
    return response;
  }

  public static InstructorCourseDetailsResponse mapCourseToInstructorCourseDetailsResponse(Course course) {
    if (course == null) return null;

    InstructorCourseDetailsResponse response = new InstructorCourseDetailsResponse();
    response.setCourse(CourseMapper.mapCourseToInstructorCourseResponse(course));
    response.setSections(course.getSections().stream().map(CourseMapper::mapSectionToInstructorSectionResponse).toList());
    return response;
  }

  public static InstructorSectionResponse mapSectionToInstructorSectionResponse(Section section) {
    if (section == null) return null;

    InstructorSectionResponse response = new InstructorSectionResponse();
    response.setId(section.getId());
    response.setTitle(section.getTitle());
    response.setTotalLessons(section.getLessons().size());
    response.setDescriptionShort(section.getDescriptionShort());
    response.setLessons(section.getLessons().stream().map(CourseMapper::mapLessonToInstructorLessonResponse).toList());
    return response;
  }

  public static InstructorLessonResponse mapLessonToInstructorLessonResponse(Lesson lesson) {
    if (lesson == null) return null;

    InstructorLessonResponse response = new InstructorLessonResponse();
    response.setId(lesson.getId());
    response.setTitle(lesson.getTitle());
    response.setPreview(lesson.getPreview());
    response.setLessonType(lesson.getLessonType());
    return response;
  }

  public static InstructorCourseInfoResponse mapCourseToInstructorCourseInfoResponse(Course course) {
    if (course == null) return null;

    InstructorCourseInfoResponse response = new InstructorCourseInfoResponse();
    response.setCourse(CourseMapper.mapCourseToInstructorCourseResponse(course));
    response.setStudents(course.getEnrollments().stream().map(enrollment -> CourseMapper.mapUserToInstructorCourseParticipantResponse(enrollment.getUser(), enrollment.getStatus())).toList());
    response.setReviews(course.getReviews().stream().map(ReviewMapper::mapReviewToReviewCourseResponse).toList());
    return response;
  }

  public static InstructorCourseParticipantResponse mapUserToInstructorCourseParticipantResponse(
      User user, EnrollmentStatus status) {
    InstructorCourseParticipantResponse response = new InstructorCourseParticipantResponse();
    response.setId(user.getId());
    response.setFullName(user.getLastName() + " " + user.getFirstName());
    response.setEmail(user.getEmail());
    response.setPhone(user.getPhone());
    response.setAvatarUrl(user.getAvatarUrl());
    response.setStatus(status);
    return response;
  }

  public static InstructorLessonDetailResponse mapLessonToInstructorLessonDetailResponse(Lesson lesson, boolean hasResource) {
    if (lesson == null) return null;

    InstructorLessonDetailResponse response = new InstructorLessonDetailResponse();
    response.setId(lesson.getId());
    response.setTitle(lesson.getTitle());
    response.setLessonType(lesson.getLessonType());
    response.setPreview(lesson.getPreview());
    response.setHasResource(hasResource);
    return response;
  }

  public static CourseEnrollmentDetailsResponse mapCourseToCourseEnrollmentDetailsResponse(Course course) {
    if (course == null) return null;

    CourseEnrollmentDetailsResponse response = new CourseEnrollmentDetailsResponse();
    response.setDescription(course.getDescription());
    response.setSlug(course.getSlug());
    response.setTitle(course.getTitle());
    response.setSections(course.getSections().stream().map(CourseMapper::mapSectionToSectionEnrollmentDetailsResponse).toList());
    return response;
  }

  public static SectionEnrollmentDetailsResponse mapSectionToSectionEnrollmentDetailsResponse(Section section) {
    if (section == null) return null;

    SectionEnrollmentDetailsResponse response = new SectionEnrollmentDetailsResponse();
    response.setTitle(section.getTitle());
    response.setLessons(section.getLessons().stream().map(CourseMapper::mapLessonToLessonEnrollmentDetailsResponse).toList());
    return response;
  }

  public static LessonEnrollmentDetailsResponse mapLessonToLessonEnrollmentDetailsResponse(Lesson lesson) {
    if (lesson == null) return null;

    LessonEnrollmentDetailsResponse response = new LessonEnrollmentDetailsResponse();
    response.setLessonId(lesson.getId());
    response.setTitle(lesson.getTitle());
    response.setLessonType(lesson.getLessonType());
    return response;
  }

  public static LessonLearningResponse mapLessonToLessonLearningResponse(Lesson lesson) {
    if (lesson == null) return null;

    LessonLearningResponse response = new LessonLearningResponse();
    response.setTitle(lesson.getTitle());
    response.setLessonType(lesson.getLessonType());
    return response;
  }

  public static CourseEnrollmentResponse mapCourseToCourseEnrollmentResponse(Course course, EnrollmentStatus active, LocalDateTime startTime) {
    if (course == null) return null;

    CourseEnrollmentResponse response = new CourseEnrollmentResponse();
    response.setTitle(course.getTitle());
    response.setSlug(course.getSlug());
    response.setAuthor(course.getInstructor().getNickname());
    response.setThumbnail(course.getThumbnail());
    response.setStatus(course.getStatus());
    response.setStartTime(startTime);
    response.setActive(active);
    return response;
  }

}
