package com.ttn.sporttn.modules.product.dto.response.admin;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BrandResponse {
    private Long id;
    private String name;
    private String slug;
    private String color;
    private String description;
    private String logoUrl;
    private String websiteUrl;
    private boolean active;
    private Long totalProducts;
}