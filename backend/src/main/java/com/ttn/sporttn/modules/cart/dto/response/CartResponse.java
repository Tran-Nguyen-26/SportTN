package com.ttn.sporttn.modules.cart.dto.response;

import java.math.BigDecimal;
import java.util.List;

import lombok.Getter;

@Getter
public class CartResponse {
    private Long id;
    private List<CartItemResponse> cartItems;
    private BigDecimal total;
}
