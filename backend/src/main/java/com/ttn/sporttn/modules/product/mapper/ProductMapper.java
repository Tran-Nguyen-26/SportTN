package com.ttn.sporttn.modules.product.mapper;

import com.ttn.sporttn.modules.product.dto.response.ImageResponse;
import com.ttn.sporttn.modules.product.dto.response.ProductCardResponse;
import com.ttn.sporttn.modules.product.dto.response.ProductPageResponse;
import com.ttn.sporttn.modules.product.dto.response.VariantResponse;
import com.ttn.sporttn.modules.product.entity.Product;
import com.ttn.sporttn.modules.product.entity.ProductVariant;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@Component
public class ProductMapper {

    public ProductCardResponse toProductCartResponse(Product product) {
        List<ProductVariant> activeVariants = product.getVariants()
                .stream()
                .filter(v -> Boolean.TRUE.equals(v.isActive()))
                .filter(ProductVariant::isInStock)
                .collect(Collectors.toList());

        //variant có giá thấp nhất
        ProductVariant cheapestVariant = activeVariants.stream()
                .min(Comparator.comparing(ProductVariant::getEffectivePrice))
                .orElse(null);

        BigDecimal minOriginalPrice = cheapestVariant != null
                ? cheapestVariant.getOriginalPrice() : BigDecimal.ZERO;

        BigDecimal minSalePrice = cheapestVariant != null
                ? cheapestVariant.getEffectivePrice() : BigDecimal.ZERO;

        Integer discountPercent = cheapestVariant != null
                ? cheapestVariant.getDiscountPercent() : 0;

        Boolean isOnSale = cheapestVariant != null
                && cheapestVariant.isOnSale();

        return ProductCardResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .description(product.getDescription())
                .mainImageUrl(product.getMainImageUrl())
                .brandName(product.getBrand() != null ? product.getBrand().getName() : null)
                .rating(product.getRating())
                .reviewCount(product.getReviewCount())
                .soldCount(product.getSoldCount())
                .originalPrice(minOriginalPrice)
                .salePrice(minSalePrice)
                .discountPercent(discountPercent)
                .isOnSale(isOnSale)
                .build();
    }

    public ProductPageResponse toProductPageResponse(Product product) {
        ProductCardResponse productCardResponse = this.toProductCartResponse(product);
        List<ImageResponse> imageUrls = product.getImages()
                .stream()
                .map(ImageResponse::buildImageResponse)
                .collect(Collectors.toList());
        List<VariantResponse> variantResponses = product.getVariants()
                .stream()
                .map(VariantResponse::buildVariantResponse)
                .collect(Collectors.toList());
        return ProductPageResponse.builder()
                .productCardResponse(productCardResponse)
                .productImageResponses(imageUrls)
                .variantResponses(variantResponses)
                .build();
    }
}
