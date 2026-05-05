package com.ttn.sporttn.modules.product.dto.response.admin;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class VariantImageResponse {
    private Long id;
    private String imageUrl;
    private Integer displayOrder;
}

