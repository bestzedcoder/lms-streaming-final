package com.hust.lms.streaming.model;

import com.hust.lms.streaming.enums.QuizType;
import com.hust.lms.streaming.model.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Entity
@Table(name = "quiz_version", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"quiz_id", "version_number"})
})
public class QuizVersion extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false, updatable = false)
    private Quiz quiz;

    @Column(name = "version_number", nullable = false, updatable = false)
    private Integer versionNumber;
}