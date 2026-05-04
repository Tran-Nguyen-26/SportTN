package com.ttn.sporttn.modules.cms.entity;

import com.ttn.sporttn.modules.category.entity.Category;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "banners")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Banner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title; // Tiêu đề banner (ví dụ: "Tự tin bơi lội")

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @Column(name = "link_url")
    private String linkUrl; // Khi click vào banner thì dẫn đến /product/category/swim

    @Column(name = "position")
    private String position; // Quan trọng: dùng để lọc (HERO, PROMO, SWIM, RUN, SUN)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    private Integer displayOrder; // Thứ tự hiển thị (1, 2, 3...)

    private Boolean active = true;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;
}
