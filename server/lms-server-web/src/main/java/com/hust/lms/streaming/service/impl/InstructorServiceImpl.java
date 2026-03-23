package com.hust.lms.streaming.service.impl;

import com.hust.lms.streaming.dto.request.instructor.InstructorUpdatingRequest;
import com.hust.lms.streaming.dto.response.instructor.InstructorInfoResponse;
import com.hust.lms.streaming.mapper.InstructorMapper;
import com.hust.lms.streaming.model.Instructor;
import com.hust.lms.streaming.model.User;
import com.hust.lms.streaming.repository.jpa.InstructorRepository;
import com.hust.lms.streaming.repository.jpa.UserRepository;
import com.hust.lms.streaming.service.InstructorService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InstructorServiceImpl implements InstructorService {
  private final InstructorRepository instructorRepository;
  private final UserRepository userRepository;

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

}
