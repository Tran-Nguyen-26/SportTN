package com.ttn.sporttn.modules.product.dto.response.admin;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class BrandResponse {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String logoUrl;
    private String websiteUrl;
    private boolean active;
    private Long totalProducts;
}