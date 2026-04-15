package com.ttn.sporttn.modules.cart.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddToCartRequest {

    @NotNull(message = "Variant ID không được để trống")
    private Long variantId;

    @NotNull(message = "Quantity không được để trống")
    @Positive(message = "Quantity phải lớn hơn 0")
    private Integer quantity;
}
