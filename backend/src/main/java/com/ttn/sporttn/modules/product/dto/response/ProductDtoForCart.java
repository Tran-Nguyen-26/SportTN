package com.ttn.sporttn.modules.product.dto.response;

import com.ttn.sporttn.modules.product.entity.Product;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ProductDtoForCart {
    private Long id;
    private String name;
    private String slug;
    private String brand;
    private Double rating;
    private Integer reviewCounts;

    public static ProductDtoForCart toProductDto(Product product) {
        return ProductDtoForCart.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .brand(product.getBrand().getName())
                .rating(product.getRating())
                .reviewCounts(product.getReviewCount())
                .build();
    }
}
