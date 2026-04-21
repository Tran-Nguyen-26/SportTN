package com.ttn.sporttn.modules.product.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
public class ProductPageResponse {

    private ProductCardResponse productCardResponse;

    private List<ImageResponse> productImageResponses;

    private List<VariantResponse> variantResponses;
}