package com.ttn.sporttn.modules.product.dto.response;

import java.math.BigDecimal;
import java.util.List;

import com.ttn.sporttn.modules.product.entity.ProductVariant;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VariantResponse {
    private Long id;
    private String sku;
    private String color;
    private String size;
    private String mainImageUrl;
    private BigDecimal originalPrice;
    private BigDecimal salePrice;
    private BigDecimal effectivePrice; 
    private Integer stockQuantity;
    private Integer weightGram;
    
    private List<ImageResponse> variantImages;

    public static VariantResponse buildVariantResponse(ProductVariant variant) {
        VariantResponse response = new VariantResponse();
        response.setId(variant.getId());
        response.setSku(variant.getSku());
        response.setColor(variant.getColor());
        response.setSize(variant.getSize());
        response.setMainImageUrl(variant.getMainImageUrl());
        response.setOriginalPrice(variant.getOriginalPrice());
        response.setSalePrice(variant.getSalePrice());
        response.setEffectivePrice(variant.getEffectivePrice());
        response.setStockQuantity(variant.getStockQuantity());
        response.setWeightGram(variant.getWeightGram());
        return response;
    }
}
