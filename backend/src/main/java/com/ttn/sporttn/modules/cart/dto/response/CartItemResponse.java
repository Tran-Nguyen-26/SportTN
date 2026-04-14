package com.ttn.sporttn.modules.cart.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.ttn.sporttn.modules.cart.entity.CartItem;
import com.ttn.sporttn.modules.product.entity.ProductImage;
import com.ttn.sporttn.modules.product.entity.ProductVariant;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CartItemResponse {
    private Long cartItemId;
    private Long variantId;
    private Integer quantity;
    private LocalDateTime addedAt;
    private BigDecimal unitPrice;
    private BigDecimal subTotal;
    private String productName;
    private String imageUrl;

    // public static CartItemResponse from(CartItem cartItem) {
    //     ProductVariant variant = cartItem.getProductVariant();
    //     BigDecimal effectivePrice = variant.getEffectivePrice();
    //     BigDecimal subTotal = effectivePrice.multiply(BigDecimal.valueOf(cartItem.getQuantity()));

    //     // // lấy ảnh chính từ variant
    //     // String mainImage = null;
    //     // if (variant.getImages() != null) {
    //     //     mainImage = variant.getImages().stream()
    //     //         .filter(ProductVariantImage::getIsMain)
    //     //         .map(ProductVariantImage::getImageUrl)
    //     //         .findFirst()
    //     //         .orElse(null);
    //     // }

    //     // // fallback sang ảnh product nếu variant không có ảnh
    //     // if (mainImage == null && variant.getProduct().getImages() != null) {
    //     //     mainImage = variant.getProduct().getImages().stream()
    //     //         .filter(ProductImage::getIsMain)
    //     //         .map(ProductImage::getImageUrl)
    //     //         .findFirst()
    //     //         .orElse(null);
    //     // }

    //     return new CartItemResponse(
    //         cartItem.getId(),
    //         variant.getId(),
    //         cartItem.getQuantity(),
    //         cartItem.getAddedAt(),
    //         effectivePrice,
    //         subTotal,
    //         variant.getProduct().getName(),
    //         mainImage
    //     );
    // }
}
