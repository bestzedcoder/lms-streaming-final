package com.hust.lms.streaming.repository.jpa;

import com.hust.lms.streaming.enums.VideoStatus;
import com.hust.lms.streaming.model.Video;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface VideoRepository extends JpaRepository<Video, UUID> {

  @Query(value = """
    SELECT v.*
    FROM videos v 
    WHERE v.id = :videoId AND v.owner_id = :ownerId
""",nativeQuery = true)
  Optional<Video> findByOwner(UUID ownerId, UUID videoId);

  @Query(value = """
    SELECT v.*
    FROM videos v
    WHERE v.owner_id = :ownerId
""",nativeQuery = true)
  List<Video> findAllByOwner(UUID ownerId);

  @Query(value = """
    SELECT v.*
    FROM videos v 
    WHERE v.status = :status AND v.owner_id = :ownerId
""",nativeQuery = true)
  List<Video> findAllByOwnerAndStatus(UUID ownerId, String status);


  @Query(value = """
    SELECT v.*
    FROM videos v 
    WHERE v.status = :status
""",nativeQuery = true)
  List<Video> findByPreview(String status);

  @Query(value = """
    SELECT EXISTS (
        SELECT 1
        FROM videos v
        WHERE v.id = :videoId AND v.status = :status
    )
""",nativeQuery = true)
  boolean existsByIdAndStatus(UUID videoId, String status);
}
