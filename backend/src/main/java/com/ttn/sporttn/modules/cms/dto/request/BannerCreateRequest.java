package com.ttn.sporttn.modules.cms.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import lombok.Getter;

import java.time.LocalDate;

@Getter
public class BannerCreateRequest {
    private String title;
    private String imageUrl;
    private String linkUrl;
    private String position;
    private Integer displayOrder;
    private Boolean active;

    private Long categoryId;

    @JsonFormat(pattern = "dd-MM-yyyy")
    @JsonDeserialize(using = LocalDateDeserializer.class)
    private LocalDate startDate;

    @JsonFormat(pattern = "dd-MM-yyyy")
    @JsonDeserialize(using = LocalDateDeserializer.class)
    private LocalDate endDate;
}
