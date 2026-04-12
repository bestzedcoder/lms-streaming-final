package com.hust.lms.streaming.repository.jpa;

import com.hust.lms.streaming.model.Resource;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ResourceRepository extends JpaRepository<Resource, UUID> {

  @Query(value = """
    SELECT r.*
    FROM resources r
    WHERE r.id = :resourceId AND r.owner_id = :ownerId
""",nativeQuery = true)
  Optional<Resource> findByOwner(UUID ownerId, UUID resourceId);

  @Query(value = """
    SELECT r.*
    FROM resources r
    WHERE r.owner_id = :ownerId
""",nativeQuery = true)
  List<Resource> findAllByOwner(UUID ownerId);

  @Query(value = """
    SELECT r.*
    FROM resources r
    WHERE r.status = :status
""",nativeQuery = true)
  List<Resource> findByPreview(String status);
}
