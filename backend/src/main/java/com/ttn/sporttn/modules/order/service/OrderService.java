package com.ttn.sporttn.modules.order.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.ttn.sporttn.modules.invoice.entity.Invoice;
import com.ttn.sporttn.modules.invoice.repository.InvoiceRepository;
import com.ttn.sporttn.modules.order.dto.request.OrderItemRequest;
import com.ttn.sporttn.modules.order.dto.request.OrderMessage;
import com.ttn.sporttn.modules.order.dto.response.OrderStatsResponse;
import com.ttn.sporttn.modules.order.entity.ShippingInfo;
import com.ttn.sporttn.modules.payment.entity.Payment;
import com.ttn.sporttn.modules.payment.repository.PaymentRepository;
import com.ttn.sporttn.modules.product.entity.Product;
import com.ttn.sporttn.modules.product.repository.ProductRepository;
import com.ttn.sporttn.modules.user.entity.Address;
import com.ttn.sporttn.modules.user.repository.AddressRepository;
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
    private final AddressRepository addressRepository;
    private final ProductRepository productRepository;
    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;

    @Transactional
    public void processOrder(OrderMessage msg) {
        User user = userRepository.findById(msg.getUserId())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        Address address = addressRepository
                .findByIdAndUserId(msg.getAddressId(), msg.getUserId())
                .orElseThrow(() -> new BusinessException(ErrorCode.ADDRESS_NOT_FOUND));

        // 3. Tạo Order
        Order order = Order.builder()
                .user(user)
                .paymentMethod(msg.getPaymentMethod())
                .customerNote(msg.getCustomerNote())
                .status("PENDING")
                .paymentStatus("UNPAID")
                .orderCode(generateOrderCode())
                .build();

        // 4. Snapshot địa chỉ → ShippingInfo
        ShippingInfo shippingInfo = ShippingInfo.builder()
                .order(order)
                .receiverName(address.getReceiverName())
                .receiverPhone(address.getReceiverPhone())
                .addressFull(buildFullAddress(address))
                .build();

        order.setShippingInfo(shippingInfo);

        // 5. Tạo OrderItems + trừ tồn kho
        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItem> items = new ArrayList<>();

        for (OrderItemRequest i : msg.getItems()) {
            ProductVariant variant = productVariantRepository.findById(i.getVariantId())
                    .orElseThrow(() -> new BusinessException(ErrorCode.VARIANT_NOT_FOUND));

            if (variant.getStockQuantity() < i.getQuantity())
                throw new BusinessException(ErrorCode.OUT_OF_STOCK,
                        variant.getProduct().getName());

            variant.setStockQuantity(variant.getStockQuantity() - i.getQuantity());
            productVariantRepository.save(variant);

            BigDecimal unitPrice = variant.getEffectivePrice();
            BigDecimal subtotal  = unitPrice.multiply(BigDecimal.valueOf(i.getQuantity()));
            totalAmount = totalAmount.add(subtotal);

            items.add(OrderItem.builder()
                    .order(order)
                    .productVariant(variant)
                    .quantity(i.getQuantity())
                    .priceAtPurchase(unitPrice)
                    .build());
        }

        // 6. Tính tiền
        BigDecimal shippingFee     = calculateShippingFee(totalAmount);
        BigDecimal voucherDiscount = BigDecimal.ZERO;
        BigDecimal pointsDiscount  = BigDecimal.ZERO;
        BigDecimal finalAmount     = totalAmount
                .add(shippingFee)
                .subtract(voucherDiscount)
                .subtract(pointsDiscount);

        order.setItems(items);
        order.setTotalAmount(totalAmount);
        order.setShippingFee(shippingFee);
        order.setVoucherDiscount(voucherDiscount);
        order.setPointsDiscountAmount(pointsDiscount);
        order.setFinalAmount(finalAmount);

        orderRepository.save(order);

        Invoice invoice = Invoice.builder()
                .order(order)
                .invoiceNumber("INV-" + String.format("%06d", order.getId()))
                .issueDate(LocalDateTime.now())
                .dueDate(LocalDateTime.now().plusDays(7))
                .subtotal(totalAmount)
                .taxAmount(BigDecimal.ZERO)
                .finalAmount(finalAmount)
                .status("PENDING")
                .note(msg.getCustomerNote())
                .build();

        invoiceRepository.save(invoice);

        if ("COD".equals(msg.getPaymentMethod())) {
            Payment payment = Payment.builder()
                    .order(order)
                    .paymentMethod("COD")
                    .amount(finalAmount)
                    .paymentStatus("PENDING")  // sẽ → COMPLETED khi DELIVERED
                    .build();
            paymentRepository.save(payment);
            log.info("[ORDER] Tạo Payment COD. orderId={}", order.getId());
        }

        cartItemRepository.deleteAllByCartUserId(msg.getUserId());
        log.info("Tạo đơn hàng thành công: code={}, user={}", order.getOrderCode(), msg.getUserId());
    }


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
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_REQUEST));

        order.setStatus(request.getStatus());

        // ✅ COD: khi DELIVERED → đánh dấu đã thanh toán
        if ("DELIVERED".equals(request.getStatus())
                && "COD".equals(order.getPaymentMethod())
                && "UNPAID".equals(order.getPaymentStatus())) {

            // Cập nhật Order
            order.setPaymentStatus("PAID");

            // Cập nhật bảng payments
            paymentRepository.findByOrderIdAndPaymentStatus(orderId, "PENDING")
                    .ifPresent(payment -> {
                        payment.setPaymentStatus("COMPLETED");
                        payment.setPaidAt(LocalDateTime.now());
                        paymentRepository.save(payment);
                        log.info("[ORDER] COD - Cập nhật Payment=COMPLETED. orderId={}", orderId);
                    });
        }

        Order updated = orderRepository.save(order);
        log.info("[ORDER] Cập nhật trạng thái thành công. orderId={}, status={}, paymentStatus={}",
                orderId, updated.getStatus(), updated.getPaymentStatus());

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

    private String buildFullAddress(Address a) {
        return String.join(", ",
                a.getAddressDetail(),
                a.getWard(),
                a.getDistrict(),
                a.getProvince());
    }

    private BigDecimal calculateShippingFee(BigDecimal totalAmount) {
        // Miễn phí ship đơn >= 500k, còn lại 30k
        return totalAmount.compareTo(new BigDecimal("500000")) >= 0
                ? BigDecimal.ZERO
                : new BigDecimal("30000");
    }

    private String generateOrderCode() {
        // TTN + timestamp + 4 số random  →  TTN20250507A3F1
        return "#DH" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"))
                + Integer.toHexString((int)(Math.random() * 0xFFFF)).toUpperCase();
    }

    /** Admin: lấy tất cả đơn hàng */
    @Transactional(readOnly = true)
    public Page<OrderResponse> getAllOrders(Pageable pageable) {
        return orderRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(OrderResponse::from);
    }

    /** Admin: xem chi tiết không cần check userId */
    @Transactional(readOnly = true)
    public OrderDetailResponse getOrderDetailAdmin(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_REQUEST));
        return OrderDetailResponse.from(order);
    }

    /** Admin: hủy đơn không cần check userId */
    @Transactional
    public OrderResponse adminCancelOrder(Long orderId, String cancelReason) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_REQUEST));

        if (!order.getStatus().equals("PENDING") && !order.getStatus().equals("CONFIRMED")) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST);
        }

        // Hoàn lại tồn kho
        for (OrderItem item : order.getItems()) {
            ProductVariant variant = item.getProductVariant();
            variant.setStockQuantity(variant.getStockQuantity() + item.getQuantity());
            productVariantRepository.save(variant);
        }

        order.setStatus("CANCELLED");
        order.setCancelReason(cancelReason);
        return OrderResponse.from(orderRepository.save(order));
    }

    public OrderStatsResponse getOrderStats() {
        return OrderStatsResponse.builder()
                .pending(orderRepository.countByStatus("PENDING"))
                .confirmed(orderRepository.countByStatus("CONFIRMED"))
                .shipping(orderRepository.countByStatus("SHIPPING"))
                .delivered(orderRepository.countByStatus("DELIVERED"))
                .cancelled(orderRepository.countByStatus("CANCELLED"))
                .build();
    }
}
