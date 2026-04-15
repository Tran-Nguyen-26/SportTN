package com.ttn.sporttn.modules.order.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ttn.sporttn.common.exception.BusinessException;
import com.ttn.sporttn.common.exception.ErrorCode;
import com.ttn.sporttn.modules.cart.repository.CartItemRepository;
import com.ttn.sporttn.modules.order.dto.request.CreateOrderRequest;
import com.ttn.sporttn.modules.order.dto.request.UpdateOrderStatusRequest;
import com.ttn.sporttn.modules.order.dto.response.OrderDetailResponse;
import com.ttn.sporttn.modules.order.dto.response.OrderResponse;
import com.ttn.sporttn.modules.order.entity.Order;
import com.ttn.sporttn.modules.order.entity.OrderItem;
import com.ttn.sporttn.modules.order.repository.OrderRepository;
import com.ttn.sporttn.modules.product.entity.ProductVariant;
import com.ttn.sporttn.modules.product.repository.ProductVariantRepository;
import com.ttn.sporttn.modules.user.entity.User;
import com.ttn.sporttn.modules.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductVariantRepository productVariantRepository;
    private final CartItemRepository cartItemRepository;

    /**
     * Create new order from cart
     */
    @Transactional
    public OrderDetailResponse createOrder(Long userId, CreateOrderRequest request) {
        log.info("[ORDER] Tạo đơn hàng mới. userId={}, itemCount={}", userId, request.getItems().size());

        // Get user
        User user = userRepository.findById(userId)
            .orElseThrow(() -> {
                log.warn("[ORDER] Người dùng không tìm thấy. userId={}", userId);
                return new BusinessException(ErrorCode.USER_NOT_FOUND);
            });

        // Validate items
        if (request.getItems() == null || request.getItems().isEmpty()) {
            log.warn("[ORDER] Giỏ hàng trống. userId={}", userId);
            throw new BusinessException(ErrorCode.INVALID_REQUEST);
        }

        // Create order
        String orderCode = generateOrderCode();
        Order order = new Order();
        order.setOrderCode(orderCode);
        order.setUser(user);
        order.setStatus("PENDING");
        order.setPaymentStatus("UNPAID");
        order.setPaymentMethod(request.getPaymentMethod());
        order.setCustomerNote(request.getCustomerNote());
        order.setShippingFee(BigDecimal.valueOf(50000)); // Fixed shipping fee for now
        order.setCreatedAt(LocalDateTime.now());
        order.setItems(new ArrayList<>());

        // Add order items and calculate total
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (var itemRequest : request.getItems()) {
            ProductVariant variant = productVariantRepository.findById(itemRequest.getVariantId())
                .orElseThrow(() -> {
                    log.warn("[ORDER] Variant không tìm thấy. variantId={}", itemRequest.getVariantId());
                    return new BusinessException(ErrorCode.PRODUCT_NOT_FOUND);
                });

            // Check stock
            if (variant.getStockQuantity() < itemRequest.getQuantity()) {
                log.warn("[ORDER] Tồn kho không đủ. variantId={}, available={}, requested={}",
                    itemRequest.getVariantId(), variant.getStockQuantity(), itemRequest.getQuantity());
                throw new BusinessException(ErrorCode.INSUFFICIENT_STOCK);
            }

            // Create order item
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProductVariant(variant);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setPriceAtPurchase(variant.getEffectivePrice());
            order.getItems().add(orderItem);

            // Calculate subtotal
            BigDecimal subtotal = variant.getEffectivePrice()
                .multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            totalAmount = totalAmount.add(subtotal);

            // Decrease stock
            variant.setStockQuantity(variant.getStockQuantity() - itemRequest.getQuantity());
            productVariantRepository.save(variant);
        }

        order.setTotalAmount(totalAmount);
        order.setVoucherDiscount(BigDecimal.ZERO);
        order.setPointsDiscountAmount(BigDecimal.ZERO);
        order.setFinalAmount(totalAmount.add(order.getShippingFee()));

        // Apply voucher if provided (placeholder for now)
        if (request.getVoucherId() != null) {
            log.debug("[ORDER] Áp dụng voucher. voucherId={}", request.getVoucherId());
            // TODO: Implement voucher logic when Voucher module is ready
        }

        // Save order
        Order savedOrder = orderRepository.save(order);
        log.info("[ORDER] Tạo đơn hàng thành công. orderId={}, orderCode={}, amount={}",
            savedOrder.getId(), savedOrder.getOrderCode(), savedOrder.getFinalAmount());

        return OrderDetailResponse.from(savedOrder);
    }

    /**
     * Get user's orders with pagination
     */
    @Transactional(readOnly = true)
    public Page<OrderResponse> getUserOrders(Long userId, Pageable pageable) {
        log.info("[ORDER] Lấy danh sách đơn hàng. userId={}, page={}", userId, pageable.getPageNumber());
        
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
            .map(OrderResponse::from);
    }

    /**
     * Get order detail by ID
     */
    @Transactional(readOnly = true)
    public OrderDetailResponse getOrderDetail(Long orderId, Long userId) {
        log.info("[ORDER] Lấy chi tiết đơn hàng. orderId={}, userId={}", orderId, userId);
        
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> {
                log.warn("[ORDER] Đơn hàng không tìm thấy. orderId={}", orderId);
                return new BusinessException(ErrorCode.INVALID_REQUEST);
            });

        // Check authorization
        if (!order.getUser().getId().equals(userId)) {
            log.warn("[ORDER] Người dùng không có quyền xem đơn hàng. orderId={}, userId={}", orderId, userId);
            throw new BusinessException(ErrorCode.UNAUTHORIZED);
        }

        return OrderDetailResponse.from(order);
    }

    /**
     * Update order status (Admin only)
     */
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request) {
        log.info("[ORDER] Cập nhật trạng thái đơn hàng. orderId={}, status={}", orderId, request.getStatus());
        
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> {
                log.warn("[ORDER] Đơn hàng không tìm thấy. orderId={}", orderId);
                return new BusinessException(ErrorCode.INVALID_REQUEST);
            });

        order.setStatus(request.getStatus());
        Order updated = orderRepository.save(order);
        
        log.info("[ORDER] Cập nhật trạng thái thành công. orderId={}, status={}", orderId, updated.getStatus());
        return OrderResponse.from(updated);
    }

    /**
     * Cancel order
     */
    @Transactional
    public OrderResponse cancelOrder(Long orderId, Long userId, String cancelReason) {
        log.info("[ORDER] Hủy đơn hàng. orderId={}, userId={}", orderId, userId);
        
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> {
                log.warn("[ORDER] Đơn hàng không tìm thấy. orderId={}", orderId);
                return new BusinessException(ErrorCode.INVALID_REQUEST);
            });

        // Check authorization
        if (!order.getUser().getId().equals(userId)) {
            log.warn("[ORDER] Người dùng không có quyền hủy đơn hàng. orderId={}, userId={}", orderId, userId);
            throw new BusinessException(ErrorCode.UNAUTHORIZED);
        }

        // Validate status
        if (!order.getStatus().equals("PENDING")) {
            log.warn("[ORDER] Chỉ có thể hủy đơn hàng PENDING. orderId={}, status={}", orderId, order.getStatus());
            throw new BusinessException(ErrorCode.INVALID_REQUEST);
        }

        // Restore stock
        for (OrderItem item : order.getItems()) {
            ProductVariant variant = item.getProductVariant();
            variant.setStockQuantity(variant.getStockQuantity() + item.getQuantity());
            productVariantRepository.save(variant);
            log.debug("[ORDER] Khôi phục tồn kho. variantId={}, quantity={}", 
                variant.getId(), item.getQuantity());
        }

        order.setStatus("CANCELLED");
        order.setCancelReason(cancelReason);
        Order updated = orderRepository.save(order);

        log.info("[ORDER] Hủy đơn hàng thành công. orderId={}", orderId);
        return OrderResponse.from(updated);
    }

    /**
     * Count total orders by user
     */
    @Transactional(readOnly = true)
    public long countUserOrders(Long userId) {
        return orderRepository.countByUserId(userId);
    }

    /**
     * Generate unique order code
     */
    private String generateOrderCode() {
        // Format: ORD-TIMESTAMP-RANDOM
        String code = "ORD-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        return code.substring(0, Math.min(code.length(), 20));
    }
}
