package com.ttn.sporttn.modules.cart.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import com.ttn.sporttn.common.exception.BusinessException;
import com.ttn.sporttn.common.exception.ErrorCode;
import com.ttn.sporttn.modules.cart.dto.response.CartItemResponse;
import com.ttn.sporttn.modules.cart.dto.response.CartResponse;
import com.ttn.sporttn.modules.cart.entity.Cart;
import com.ttn.sporttn.modules.cart.repository.CartRepository;
import com.ttn.sporttn.modules.user.entity.User;
import com.ttn.sporttn.modules.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;

    public CartResponse getCart(Long userId) {
        Cart cart = getOrCreatedCart(userId);
        return null;
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

    // private CartResponse buildCartResponse(Cart cart) {

    //     List<CartItemResponse> items  = cart.getItems()
    //         .stream()
    //         .map(CartItemResponse::from)
    //         .toList();
        
    // }

//     private CartResponse buildCartResponse(Cart cart) {
//     List<CartResponse.CartItemResponse> items = cart.getItems()
//       .stream()
//       .map(CartResponse.CartItemResponse::from)
//       .toList();

//     // T�nh total qua CatalogPort
//     BigDecimal total = cart.getItems().stream()
//       .map(item -> {
//         try {
//           CatalogPort.VariantSnapshot v =
//             catalogPort.getVariantBySku(item.getSku());
//           return v.price().multiply(
//             BigDecimal.valueOf(item.getQuantity()));
//         } catch (BusinessException e) {
//           return BigDecimal.ZERO; // SKU kh�ng c�n t?n t?i
//         }
//       })
//       .reduce(BigDecimal.ZERO, BigDecimal::add);

//     return new CartResponse(cart.getId(), items, total);
//   }
    
}
