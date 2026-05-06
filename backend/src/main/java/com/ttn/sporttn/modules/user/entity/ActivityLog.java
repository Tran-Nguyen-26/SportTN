package com.ttn.sporttn.modules.user.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

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

    private String type;
    private String action;
    private String device;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Transient
    public String getFormattedTime() {
        return formatRelativeTime(this.createdAt);
    }

    private static String formatRelativeTime(LocalDateTime time) {
        LocalDateTime now = LocalDateTime.now();
        LocalDate today = now.toLocalDate();
        LocalDate logDate = time.toLocalDate();

        if (logDate.isEqual(today)) {
            return time.format(DateTimeFormatter.ofPattern("HH:mm")) + " hôm nay";
        } else if (logDate.isEqual(today.minusDays(1))) {
            return time.format(DateTimeFormatter.ofPattern("HH:mm")) + " hôm qua";
        }
        return time.format(DateTimeFormatter.ofPattern("dd/MM HH:mm"));
    }
}
