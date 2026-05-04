package com.ttn.sporttn.modules.cms.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class BannerResponse {
    private Long id;
    private String title;
    private String imageUrl;
    private String linkUrl;
    private String position;
    private Boolean active;

    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate startDate;

    @JsonFormat(pattern = "dd-MM-yyy")
    private LocalDate endDate;

    private int displayOrder;
}
