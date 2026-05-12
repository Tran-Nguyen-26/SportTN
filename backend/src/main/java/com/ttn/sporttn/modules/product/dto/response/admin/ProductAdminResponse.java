package com.ttn.sporttn.modules.product.dto.response.admin;


import com.ttn.sporttn.modules.product.entity.Product;
import com.ttn.sporttn.modules.product.entity.ProductVariant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class ProductAdminResponse {
    private Long    id;
    private String  name;
    private String  categoryName;
    private String  brandName;
    private Double  minPrice;
    private Integer totalStock;
    private Integer soldCount;
    private Double  rating;
    private Boolean active;
    private String  mainImageUrl;

    public static ProductAdminResponse from(Product product) {
        return ProductAdminResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .brandName(product.getBrand() != null ? product.getBrand().getName() : null)
                .minPrice(product.getVariants().stream()
                        .filter(ProductVariant::isActive)
                        .mapToDouble(v -> v.getEffectivePrice().doubleValue())
                        .min()
                        .orElse(0.0))
                .totalStock(product.getVariants().stream()
                        .filter(ProductVariant::isActive)
                        .mapToInt(ProductVariant::getStockQuantity)
                        .sum())
                .soldCount(product.getSoldCount())
                .rating(product.getRating())
                .active(product.isActive())
                .mainImageUrl(product.getMainImageUrl())
                .build();
    }
}
