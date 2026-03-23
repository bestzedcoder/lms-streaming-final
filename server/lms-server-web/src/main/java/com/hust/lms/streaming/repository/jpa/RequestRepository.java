package com.hust.lms.streaming.repository.jpa;

import com.hust.lms.streaming.enums.RequestType;
import com.hust.lms.streaming.model.Request;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RequestRepository extends JpaRepository<Request, UUID> {
  Optional<Request> findByIdAndRequestType(UUID requestId, RequestType type);
}
