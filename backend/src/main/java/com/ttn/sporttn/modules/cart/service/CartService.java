package com.ttn.sporttn.modules.cart.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.ttn.sporttn.modules.product.dto.response.ProductDtoForCart;
import com.ttn.sporttn.modules.product.dto.response.VariantResponse;
import com.ttn.sporttn.modules.product.entity.Product;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ttn.sporttn.common.exception.BusinessException;
import com.ttn.sporttn.common.exception.ErrorCode;
import com.ttn.sporttn.modules.cart.dto.response.CartItemResponse;
import com.ttn.sporttn.modules.cart.dto.response.CartResponse;
import com.ttn.sporttn.modules.cart.entity.Cart;
import com.ttn.sporttn.modules.cart.entity.CartItem;
import com.ttn.sporttn.modules.cart.repository.CartItemRepository;
import com.ttn.sporttn.modules.cart.repository.CartRepository;
import com.ttn.sporttn.modules.product.entity.ProductVariant;
import com.ttn.sporttn.modules.product.repository.ProductVariantRepository;
import com.ttn.sporttn.modules.user.entity.User;
import com.ttn.sporttn.modules.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductVariantRepository productVariantRepository;

    @Transactional(readOnly = true)
    public CartResponse getCart(Long userId) {
        log.info("[CART] Lấy giỏ hàng của user. userId={}", userId);
        Cart cart = getOrCreatedCart(userId);
        return buildCartResponse(cart);
    }

    @Transactional
    public CartResponse addItemToCart(Long userId, Long variantId, Integer quantity) {
        log.info("[CART] Thêm sản phẩm vào giỏ. userId={}, variantId={}, quantity={}", userId, variantId, quantity);
        
        if (quantity <= 0) {
            log.warn("[CART] Số lượng không hợp lệ. userId={}, quantity={}", userId, quantity);
            throw new BusinessException(ErrorCode.INVALID_QUANTITY);
        }

        Cart cart = getOrCreatedCart(userId);

        ProductVariant variant = productVariantRepository.findById(variantId)
            .orElseThrow(() -> {
                log.warn("[CART] Variant không tìm thấy. userId={}, variantId={}", userId, variantId);
                return new BusinessException(ErrorCode.PRODUCT_NOT_FOUND);
            });

        if (variant.getStockQuantity() < quantity) {
            log.warn("[CART] Tồn kho không đủ. userId={}, variantId={}, available={}, requested={}", 
                userId, variantId, variant.getStockQuantity(), quantity);
            throw new BusinessException(ErrorCode.INSUFFICIENT_STOCK);
        }

        CartItem existingItem = cartItemRepository.findByCartIdAndProductVariantId(
            cart.getId(), variantId).orElse(null);

        if (existingItem != null) {
            int newQuantity = existingItem.getQuantity() + quantity;
            if (variant.getStockQuantity() < newQuantity) {
                log.warn("[CART] Tồn kho không đủ khi cập nhật. userId={}, variantId={}, available={}, requested={}", 
                    userId, variantId, variant.getStockQuantity(), newQuantity);
                throw new BusinessException(ErrorCode.INSUFFICIENT_STOCK);
            }
            existingItem.setQuantity(newQuantity);
            cartItemRepository.save(existingItem);
            log.info("[CART] Cập nhật số lượng sản phẩm trong giỏ. userId={}, variantId={}, newQuantity={}", 
                userId, variantId, newQuantity);
        } else {
            CartItem cartItem = CartItem.builder()
                .cart(cart)
                .productVariant(variant)
                .quantity(quantity)
                .addedAt(LocalDateTime.now())
                .build();
            cartItemRepository.save(cartItem);
            log.info("[CART] Thêm sản phẩm mới vào giỏ. userId={}, variantId={}, quantity={}", 
                userId, variantId, quantity);
        }

        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);

        return buildCartResponse(cart);
    }

    @Transactional
    public CartResponse removeItemFromCart(Long userId, Long cartItemId) {
        log.info("[CART] Xóa sản phẩm khỏi giỏ. userId={}, cartItemId={}", userId, cartItemId);
        
        Cart cart = getOrCreatedCart(userId);

        CartItem cartItem = cartItemRepository.findById(cartItemId)
            .orElseThrow(() -> {
                log.warn("[CART] Cart item không tìm thấy. userId={}, cartItemId={}", userId, cartItemId);
                return new BusinessException(ErrorCode.CART_ITEM_NOT_FOUND);
            });

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            log.warn("[CART] Người dùng không có quyền xóa item này. userId={}, cartItemId={}", userId, cartItemId);
            throw new BusinessException(ErrorCode.UNAUTHORIZED);
        }

        cartItemRepository.delete(cartItem);

        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);

        log.info("[CART] Xóa sản phẩm khỏi giỏ thành công. userId={}, cartItemId={}", userId, cartItemId);
        return getCart(userId);
    }

    @Transactional
    public CartResponse updateItemQuantity(Long userId, Long cartItemId, Integer newQuantity) {
        log.info("[CART] Cập nhật số lượng sản phẩm. userId={}, cartItemId={}, newQuantity={}", 
            userId, cartItemId, newQuantity);
        
        if (newQuantity <= 0) {
            log.warn("[CART] Số lượng không hợp lệ. userId={}, newQuantity={}", userId, newQuantity);
            throw new BusinessException(ErrorCode.INVALID_QUANTITY);
        }

        Cart cart = getOrCreatedCart(userId);

        CartItem cartItem = cartItemRepository.findById(cartItemId)
            .orElseThrow(() -> {
                log.warn("[CART] Cart item không tìm thấy. userId={}, cartItemId={}", userId, cartItemId);
                return new BusinessException(ErrorCode.CART_ITEM_NOT_FOUND);
            });

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            log.warn("[CART] Người dùng không có quyền cập nhật item này. userId={}, cartItemId={}", userId, cartItemId);
            throw new BusinessException(ErrorCode.UNAUTHORIZED);
        }

        ProductVariant variant = cartItem.getProductVariant();
        if (variant.getStockQuantity() < newQuantity) {
            log.warn("[CART] Tồn kho không đủ khi cập nhật. userId={}, cartItemId={}, available={}, requested={}", 
                userId, cartItemId, variant.getStockQuantity(), newQuantity);
            throw new BusinessException(ErrorCode.INSUFFICIENT_STOCK);
        }

        cartItem.setQuantity(newQuantity);
        cartItemRepository.save(cartItem);

        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);

        log.info("[CART] Cập nhật số lượng thành công. userId={}, cartItemId={}, newQuantity={}", 
            userId, cartItemId, newQuantity);
        return buildCartResponse(cart);
    }

    @Transactional
    public void clearCart(Long userId) {
        log.info("[CART] Xóa toàn bộ giỏ hàng. userId={}", userId);
        
        Cart cart = getOrCreatedCart(userId);
        cartItemRepository.deleteByCartId(cart.getId());
        
        cart.setUpdatedAt(LocalDateTime.now());
        cartRepository.save(cart);
        
        log.info("[CART] Xóa giỏ hàng thành công. userId={}", userId);
    }

    private Cart getOrCreatedCart(Long userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
            Cart cart = new Cart();
            cart.setUser(user);
            return cartRepository.save(cart);
        });
    }

    private CartResponse buildCartResponse(Cart cart) {
        List<CartItemResponse> items = (cart.getItems() == null) ? List.of() : cart.getItems()
            .stream()
            .map(this::mapToCartItemResponse)
            .toList();

        BigDecimal total = calculateCartTotal(cart);

        CartResponse response = new CartResponse();
        response.setId(cart.getId());
        response.setCartItems(items);
        response.setTotal(total);

        return response;
    }

    private CartItemResponse mapToCartItemResponse(CartItem cartItem) {
        ProductVariant variant = cartItem.getProductVariant();
        Product product = variant.getProduct();
        BigDecimal unitPrice = variant.getEffectivePrice();
        BigDecimal subTotal = unitPrice.multiply(BigDecimal.valueOf(cartItem.getQuantity()));

        return new CartItemResponse(
            cartItem.getId(),
            VariantResponse.buildVariantResponse(variant),
            cartItem.getQuantity(),
            cartItem.getAddedAt(),
            subTotal,
            ProductDtoForCart.toProductDto(product)
        );
    }

    private BigDecimal calculateCartTotal(Cart cart) {
        return cart.getItems().stream()
            .map(item -> {
                ProductVariant variant = item.getProductVariant();
                BigDecimal unitPrice = variant.getEffectivePrice();
                return unitPrice.multiply(BigDecimal.valueOf(item.getQuantity()));
            })
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private String getMainImageUrl(ProductVariant variant) {
        if (variant.getVariantImages() != null && !variant.getVariantImages().isEmpty()) {
            return variant.getVariantImages().stream()
                .filter(img -> img.isMain())
                .map(img -> img.getImageUrl())
                .findFirst()
                .orElse(null);
        }

        if (variant.getProduct() != null && variant.getProduct().getImages() != null) {
            return variant.getProduct().getImages().stream()
                .filter(img -> img.isMain())
                .map(img -> img.getImageUrl())
                .findFirst()
                .orElse(null);
        }

        return null;
    }
}
