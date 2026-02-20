package com.hust.lms.streaming.mapper;

import com.hust.lms.streaming.dto.response.course.CourseAuthDetailsResponse;
import com.hust.lms.streaming.dto.response.course.CoursePublicDetailsResponse;
import com.hust.lms.streaming.dto.response.course.InstructorPublicResponse;
import com.hust.lms.streaming.dto.response.course.LessonPublicResponse;
import com.hust.lms.streaming.dto.response.course.SectionPublicResponse;
import com.hust.lms.streaming.model.Course;
import com.hust.lms.streaming.model.Instructor;
import com.hust.lms.streaming.model.Lesson;
import com.hust.lms.streaming.model.Section;

public class CourseMapper {
  private CourseMapper() {
    throw new AssertionError("Utility class");
  }

  public static CourseAuthDetailsResponse mapCourseToCourseAuthDetailsResponse(Course course, Boolean hasAccess) {
    CourseAuthDetailsResponse response = new CourseAuthDetailsResponse();
    response.setCourse(CourseMapper.mapCourseToCoursePublicDetailsResponse(course));
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
    response.setPrice(course.getPrice());
    response.setSalePrice(course.getSalePrice());
    response.setLevel(course.getLevel());
    response.setAverageRating(course.getAverageRating());
    response.setCountRating(course.getCountRating());
    response.setCountStudents(course.getEnrollments().size());
    response.setThumbnail(course.getThumbnail());
    response.setTotalSections(course.getSections().size());
    response.setTotalLessons(course.getSections().stream().map(section -> section.getLessons().size()).reduce(0, Integer::sum));
    response.setUpdatedAt(course.getUpdatedAt());
    response.setSections(course.getSections().stream().map(CourseMapper::mapSectionToSectionPublicResponse).toList());
    response.setReviews(course.getReviews().stream().map(ReviewMapper::mapReviewToReviewPublicResponse).toList());
    response.setInstructor(CourseMapper.mapInstructorToInstructorPublicResponse(course.getInstructor()));
    return response;
  }

  public static SectionPublicResponse mapSectionToSectionPublicResponse(Section section) {
    if (section == null) return null;

    SectionPublicResponse response = new SectionPublicResponse();
    response.setTitle(section.getTitle());
    response.setDescriptionShort(section.getDescriptionShort());
    response.setLessons(section.getLessons().stream().filter(Lesson::getIsPreview).map(CourseMapper::mapLessonToLessonPublicResponse).toList());
    return response;
  }

  public static LessonPublicResponse mapLessonToLessonPublicResponse(Lesson lesson) {
    if (lesson == null) return null;

    LessonPublicResponse response = new LessonPublicResponse();
    response.setTitle(lesson.getTitle());
    response.setLessonType(lesson.getLessonType());
    return response;
  }

  public static InstructorPublicResponse mapInstructorToInstructorPublicResponse(Instructor instructor) {
    if (instructor == null)  return null;

    InstructorPublicResponse response = new InstructorPublicResponse();
    response.setFullName(instructor.getUser().getFullName());
    response.setTitle(instructor.getTitle());
    response.setBio(instructor.getBio());
    response.setAvatarUrl(instructor.getUser().getAvatarUrl());
    response.setTotalCourses(instructor.getCourses().size());
    return response;
  }
}
