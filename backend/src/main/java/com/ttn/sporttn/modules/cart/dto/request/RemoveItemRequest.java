package com.ttn.sporttn.modules.cart.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RemoveItemRequest {

    @NotNull(message = "Cart item ID không được để trống")
    private Long cartItemId;
}
