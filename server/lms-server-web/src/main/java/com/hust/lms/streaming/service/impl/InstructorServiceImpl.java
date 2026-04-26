package com.hust.lms.streaming.service.impl;

import com.hust.lms.streaming.dto.request.instructor.InstructorUpdatingRequest;
import com.hust.lms.streaming.dto.request.upload.ResourceCreatingRequest;
import com.hust.lms.streaming.dto.request.upload.ResourceUpdatingRequest;
import com.hust.lms.streaming.dto.request.upload.VideoCreatingRequest;
import com.hust.lms.streaming.dto.request.upload.VideoUpdatingRequest;
import com.hust.lms.streaming.dto.response.instructor.InstructorInfoResponse;
import com.hust.lms.streaming.enums.ResourceStatus;
import com.hust.lms.streaming.enums.VideoStatus;
import com.hust.lms.streaming.event.custom.ResourceValidationEvent;
import com.hust.lms.streaming.event.enums.ResourceType;
import com.hust.lms.streaming.exception.BadRequestException;
import com.hust.lms.streaming.mapper.InstructorMapper;
import com.hust.lms.streaming.model.Instructor;
import com.hust.lms.streaming.model.Resource;
import com.hust.lms.streaming.model.User;
import com.hust.lms.streaming.model.Video;
import com.hust.lms.streaming.repository.jpa.InstructorRepository;
import com.hust.lms.streaming.repository.jpa.ResourceRepository;
import com.hust.lms.streaming.repository.jpa.UserRepository;
import com.hust.lms.streaming.repository.jpa.VideoRepository;
import com.hust.lms.streaming.service.InstructorService;
import java.util.UUID;

import com.hust.lms.streaming.upload.CloudinaryService;
import com.hust.lms.streaming.upload.CloudinaryUploadResult;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class InstructorServiceImpl implements InstructorService {
  private final InstructorRepository instructorRepository;
  private final UserRepository userRepository;
  private final CloudinaryService cloudinaryService;
  private final ResourceRepository resourceRepository;
  private final VideoRepository videoRepository;
  private final ApplicationEventPublisher eventPublisher;

  @Override
  public void update(InstructorUpdatingRequest request) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    User currentUser = this.userRepository.getReferenceById(UUID.fromString(authId));
    Instructor instructor = this.instructorRepository.findById(UUID.fromString(authId)).orElse(
        Instructor.builder()
            .user(currentUser)
            .build()
    );

    instructor.setNickname(request.getNickname());
    instructor.setJobTitle(request.getJobTitle());
    instructor.setBio(request.getBio());
    this.instructorRepository.save(instructor);
  }

  @Override
  public InstructorInfoResponse getInfo() {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();

    Instructor instructor = this.instructorRepository.findById(UUID.fromString(authId)).orElse(null);

    return InstructorMapper.mapInstructorToInstructorInfoResponse(instructor);
  }

  @Override
  @Transactional
  public void createVideoRecord(VideoCreatingRequest request) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    Instructor instructor = this.instructorRepository.getReferenceById(UUID.fromString(authId));

    Video video = this.videoRepository.save(Video.builder()
            .title(request.getTitle())
            .duration(request.getDuration())
            .originalUrl(request.getFileKey())
            .size(request.getSize())
            .status(VideoStatus.VALIDATING)
            .owner(instructor)
            .build());
    this.eventPublisher.publishEvent(new ResourceValidationEvent(ResourceType.VIDEO, video.getId(), video.getOriginalUrl()));
  }

  @Override
  @Transactional
  public void createResourceRecord(ResourceCreatingRequest request) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    Instructor instructor = this.instructorRepository.getReferenceById(UUID.fromString(authId));

    Resource lecture = this.resourceRepository.save(Resource.builder()
            .url(request.getFileKey())
            .title(request.getTitle())
            .size(request.getSize())
            .status(ResourceStatus.VALIDATING)
            .owner(instructor)
            .build());
    this.eventPublisher.publishEvent(new ResourceValidationEvent(ResourceType.LECTURE, lecture.getId(), lecture.getUrl()));
  }

  @Override
  public void updateResourceRecord(ResourceUpdatingRequest request) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    Resource resource = this.resourceRepository.findByOwner(UUID.fromString(authId), UUID.fromString(request.getResourceId())).orElseThrow(() -> new BadRequestException("Không tồn tại tài nguyên"));
    resource.setTitle(request.getTitle());
    this.resourceRepository.save(resource);
  }

  @Override
  public void updateVideoRecord(VideoUpdatingRequest request, MultipartFile image) {
    String authId = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    Video video = this.videoRepository.findByOwner(UUID.fromString(authId), UUID.fromString(request.getVideoId())).orElseThrow(() -> new BadRequestException("Không tồn tại tài nguyên"));
    if (image != null) {
      if (video.getThumbnail() != null) {
        this.cloudinaryService.deleteImage(video.getPublicId());
      }
      CloudinaryUploadResult res = this.cloudinaryService.uploadImage(image, "video");
      video.setThumbnail(res.getUrl());
      video.setPublicId(res.getPublicId());
    }
    video.setTitle(request.getTitle());
    this.videoRepository.save(video);
  }

}
