package com.ttn.sporttn.modules.user.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "activity_logs")
@Getter
@Setter
@NoArgsConstructor
public class ActivityLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String type;   // create, edit, delete, login...
    private String action; // Mô tả hành động
    private String device; // Lưu thông tin trình duyệt/OS như FE yêu cầu

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
