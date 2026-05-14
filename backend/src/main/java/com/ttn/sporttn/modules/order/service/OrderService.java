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
import org.springframework.data.jpa.domain.Specification;
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
import org.springframework.util.StringUtils;

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

        Order order = Order.builder()
                .user(user)
                .paymentMethod(msg.getPaymentMethod())
                .customerNote(msg.getCustomerNote())
                .status("PENDING")
                .paymentStatus("UNPAID")
                .orderCode(generateOrderCode())
                .build();

        ShippingInfo shippingInfo = ShippingInfo.builder()
                .order(order)
                .receiverName(address.getReceiverName())
                .receiverPhone(address.getReceiverPhone())
                .addressFull(buildFullAddress(address))
                .build();

        order.setShippingInfo(shippingInfo);

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

        if ("COD".equals(msg.getPaymentMethod())) {
            Payment payment = Payment.builder()
                    .order(order)
                    .paymentMethod("COD")
                    .amount(finalAmount)
                    .paymentStatus("PENDING")
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

        User user = userRepository.findById(userId)
            .orElseThrow(() -> {
                log.warn("[ORDER] Người dùng không tìm thấy. userId={}", userId);
                return new BusinessException(ErrorCode.USER_NOT_FOUND);
            });

        if (request.getItems() == null || request.getItems().isEmpty()) {
            log.warn("[ORDER] Giỏ hàng trống. userId={}", userId);
            throw new BusinessException(ErrorCode.INVALID_REQUEST);
        }

        String orderCode = generateOrderCode();
        Order order = new Order();
        order.setOrderCode(orderCode);
        order.setUser(user);
        order.setStatus("PENDING");
        order.setPaymentStatus("UNPAID");
        order.setPaymentMethod(request.getPaymentMethod());
        order.setCustomerNote(request.getCustomerNote());
        order.setShippingFee(BigDecimal.valueOf(50000));
        order.setCreatedAt(LocalDateTime.now());
        order.setItems(new ArrayList<>());

        BigDecimal totalAmount = BigDecimal.ZERO;
        for (var itemRequest : request.getItems()) {
            ProductVariant variant = productVariantRepository.findById(itemRequest.getVariantId())
                .orElseThrow(() -> {
                    log.warn("[ORDER] Variant không tìm thấy. variantId={}", itemRequest.getVariantId());
                    return new BusinessException(ErrorCode.PRODUCT_NOT_FOUND);
                });

            if (variant.getStockQuantity() < itemRequest.getQuantity()) {
                log.warn("[ORDER] Tồn kho không đủ. variantId={}, available={}, requested={}",
                    itemRequest.getVariantId(), variant.getStockQuantity(), itemRequest.getQuantity());
                throw new BusinessException(ErrorCode.INSUFFICIENT_STOCK);
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProductVariant(variant);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setPriceAtPurchase(variant.getEffectivePrice());
            order.getItems().add(orderItem);

            BigDecimal subtotal = variant.getEffectivePrice()
                .multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            totalAmount = totalAmount.add(subtotal);

            variant.setStockQuantity(variant.getStockQuantity() - itemRequest.getQuantity());
            productVariantRepository.save(variant);
        }

        order.setTotalAmount(totalAmount);
        order.setVoucherDiscount(BigDecimal.ZERO);
        order.setPointsDiscountAmount(BigDecimal.ZERO);
        order.setFinalAmount(totalAmount.add(order.getShippingFee()));

        if (request.getVoucherId() != null) {
            log.debug("[ORDER] Áp dụng voucher. voucherId={}", request.getVoucherId());
        }

        Order savedOrder = orderRepository.save(order);
        log.info("[ORDER] Tạo đơn hàng thành công. orderId={}, orderCode={}, amount={}",
            savedOrder.getId(), savedOrder.getOrderCode(), savedOrder.getFinalAmount());

        return OrderDetailResponse.from(savedOrder);
    }

    @Transactional(readOnly = true)
    public Page<OrderResponse> getUserOrders(Long userId, Pageable pageable) {
        log.info("[ORDER] Lấy danh sách đơn hàng. userId={}, page={}", userId, pageable.getPageNumber());
        
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
            .map(OrderResponse::from);
    }

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

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_REQUEST));

        String newStatus = request.getStatus();
        order.setStatus(newStatus);

        if ("CONFIRMED".equals(newStatus)) {
            boolean invoiceExists = invoiceRepository.findByOrderId(orderId).isPresent();
            if (!invoiceExists) {
                Invoice invoice = Invoice.builder()
                        .order(order)
                        .invoiceNumber("INV-" + String.format("%06d", order.getId()))
                        .issueDate(LocalDateTime.now())
                        .dueDate(LocalDateTime.now().plusDays(7))
                        .subtotal(order.getTotalAmount())
                        .taxAmount(BigDecimal.ZERO)
                        .finalAmount(order.getFinalAmount())
                        .status("PENDING")
                        .note(order.getCustomerNote())
                        .build();
                invoiceRepository.save(invoice);
                log.info("[ORDER] Invoice tạo mới. orderId={}", orderId);
            }
        }

        if ("DELIVERED".equals(newStatus)) {
            for (OrderItem item : order.getItems()) {
                Product product = item.getProductVariant().getProduct();
                product.setSoldCount(product.getSoldCount() + item.getQuantity());
                productRepository.save(product);
            }

            invoiceRepository.findByOrderId(orderId)
                    .ifPresent(invoice -> {
                        invoice.setStatus("PAID");
                        invoiceRepository.save(invoice);
                        log.info("[ORDER] Invoice PAID. orderId={}", orderId);
                    });

            if ("COD".equals(order.getPaymentMethod())
                    && "UNPAID".equals(order.getPaymentStatus())) {
                order.setPaymentStatus("PAID");
                paymentRepository.findByOrderIdAndPaymentStatus(orderId, "PENDING")
                        .ifPresent(payment -> {
                            payment.setPaymentStatus("COMPLETED");
                            payment.setPaidAt(LocalDateTime.now());
                            paymentRepository.save(payment);
                            log.info("[ORDER] COD Payment COMPLETED. orderId={}", orderId);
                        });
            }
        }

        if ("CANCELLED".equals(newStatus)) {
            for (OrderItem item : order.getItems()) {
                ProductVariant variant = item.getProductVariant();
                variant.setStockQuantity(variant.getStockQuantity() + item.getQuantity());
                productVariantRepository.save(variant);
            }

            Invoice invoice = invoiceRepository.findByOrderId(orderId).orElse(null);
            if (invoice != null) {
                invoiceRepository.delete(invoice);
                invoiceRepository.flush();
                log.info("[ORDER] Invoice đã xoá. orderId={}", orderId);
            }
        }

        Order updated = orderRepository.save(order);
        return OrderResponse.from(updated);
    }

    @Transactional
    public OrderResponse cancelOrder(Long orderId, Long userId, String cancelReason) {
        log.info("[ORDER] Customer hủy đơn. orderId={}, userId={}", orderId, userId);

        Order order = orderRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.ORDER_NOT_FOUND));

        String currentStatus = order.getStatus();
        if (!"PENDING".equals(currentStatus) && !"CONFIRMED".equals(currentStatus)) {
            throw new RuntimeException("Không thể hủy đơn hàng");
        }

        for (OrderItem item : order.getItems()) {
            ProductVariant variant = item.getProductVariant();
            if (variant != null && variant.getStockQuantity() != null) {
                variant.setStockQuantity(variant.getStockQuantity() + item.getQuantity());
                productVariantRepository.save(variant);
            }
        }

        order.setStatus("CANCELLED");
        order.setCancelReason(cancelReason);

        Order updatedOrder = orderRepository.save(order);

        log.info("[ORDER] Hủy thành công. orderId={}", orderId);
        return OrderResponse.from(updatedOrder);
    }


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

    public Page<OrderResponse> getAllOrders(Pageable pageable, String keyword, String status) {
        Specification<Order> spec = Specification.where(null);

        if (StringUtils.hasText(status)) {
            spec = spec.and((root, q, cb) ->
                    cb.equal(root.get("status"), status));
        }

        if (StringUtils.hasText(keyword)) {
            spec = spec.and((root, q, cb) -> cb.or(
                    cb.like(cb.lower(root.get("orderCode")), "%" + keyword.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("user").get("fullname")), "%" + keyword.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("user").get("phone")), "%" + keyword.toLowerCase() + "%")
            ));
        }

        return orderRepository.findAll(spec, pageable).map(OrderResponse::from);
    }

    @Transactional(readOnly = true)
    public OrderDetailResponse getOrderDetailAdmin(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_REQUEST));
        return OrderDetailResponse.from(order);
    }

    @Transactional
    public OrderResponse adminCancelOrder(Long orderId, String cancelReason) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_REQUEST));

        if (!order.getStatus().equals("PENDING") && !order.getStatus().equals("CONFIRMED")) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST);
        }

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
