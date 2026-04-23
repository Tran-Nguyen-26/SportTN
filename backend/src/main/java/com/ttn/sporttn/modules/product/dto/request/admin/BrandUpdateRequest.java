package com.ttn.sporttn.modules.product.dto.request.admin;

import lombok.Getter;

@Getter
public class BrandUpdateRequest {
    private String name;
    private String slug;
    private String color;
    private String description;
    private String logoUrl;
    private String websiteUrl;
    private boolean active;
}
