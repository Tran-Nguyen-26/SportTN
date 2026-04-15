package com.ttn.sporttn.modules.cart.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ttn.sporttn.common.dto.ApiResponse;
import com.ttn.sporttn.modules.cart.dto.request.AddToCartRequest;
import com.ttn.sporttn.modules.cart.dto.request.UpdateQuantityRequest;
import com.ttn.sporttn.modules.cart.dto.response.CartResponse;
import com.ttn.sporttn.modules.cart.service.CartService;
import com.ttn.sporttn.security.CustomUserDetails;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<ApiResponse<CartResponse>> getCart(
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long userId = userDetails.getId();
        CartResponse cartResponse = cartService.getCart(userId);
        return ResponseEntity.ok(ApiResponse.ok(cartResponse, "Lấy giỏ hàng thành công"));
    }

    @PostMapping("/items")
    public ResponseEntity<ApiResponse<CartResponse>> addItemToCart(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @Valid @RequestBody AddToCartRequest request
    ) {
        Long userId = userDetails.getId();
        CartResponse cartResponse = cartService.addItemToCart(userId, request.getVariantId(), request.getQuantity());
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok(cartResponse, "Thêm sản phẩm vào giỏ hàng thành công"));
    }

    @PutMapping("/items")
    public ResponseEntity<ApiResponse<CartResponse>> updateItemQuantity(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @Valid @RequestBody UpdateQuantityRequest request
    ) {
        Long userId = userDetails.getId();
        CartResponse cartResponse = cartService.updateItemQuantity(userId, request.getCartItemId(), request.getQuantity());
        return ResponseEntity.ok(ApiResponse.ok(cartResponse, "Cập nhật số lượng thành công"));
    }

    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<ApiResponse<CartResponse>> removeItemFromCart(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @PathVariable Long cartItemId
    ) {
        Long userId = userDetails.getId();
        CartResponse cartResponse = cartService.removeItemFromCart(userId, cartItemId);
        return ResponseEntity.ok(ApiResponse.ok(cartResponse, "Xóa sản phẩm khỏi giỏ hàng thành công"));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> clearCart(
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long userId = userDetails.getId();
        cartService.clearCart(userId);
        return ResponseEntity.ok(ApiResponse.ok("Xóa giỏ hàng thành công"));
    }
}

