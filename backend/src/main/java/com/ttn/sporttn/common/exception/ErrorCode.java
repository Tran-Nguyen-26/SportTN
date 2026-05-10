package com.ttn.sporttn.common.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // ── Auth ───────────────────────────────────────
    INVALID_CREDENTIALS ("AUTH_001", "Email hoặc mật khẩu không đúng", HttpStatus.UNAUTHORIZED),
    TOKEN_EXPIRED ("AUTH_002", "Token đã hết hạn", HttpStatus.UNAUTHORIZED),
    TOKEN_INVALID ("AUTH_003", "Token không hợp lệ", HttpStatus.UNAUTHORIZED),
    RESET_TOKEN_INVALID ("AUTH_004", "Token đã hết hạn hoặc không hợp lệ", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED ("AUTH_005", "Bạn chưa đăng nhập", HttpStatus.UNAUTHORIZED),
    FORBIDDEN ("AUTH_006", "Bạn không có quyền thực hiện", HttpStatus.FORBIDDEN),

    // ── User ───────────────────────────────────────
    USER_NOT_FOUND        ("USER_001", "Không tìm thấy người dùng",         HttpStatus.NOT_FOUND),
    EMAIL_ALREADY_EXISTS  ("USER_002", "Email đã được sử dụng",             HttpStatus.CONFLICT),
    ADDRESS_NOT_FOUND     ("USER_003", "Không tìm thấy địa chỉ",            HttpStatus.NOT_FOUND),
    PASSWORD_NOT_MATCH    ("USER_004", "Mật khẩu xác nhận không khớp",    HttpStatus.BAD_REQUEST),
    SAME_PASSWORD         ("USER_005", "Mật khẩu mới không được giống cũ", HttpStatus.BAD_REQUEST),
    USERNAME_ALREADY_EXISTS("USER_006", "Tên người dùng đã được sử dụng", HttpStatus.CONFLICT),
    PHONE_ALREADY_EXISTS("USER_007", "Số điện thoại đã được sử dụng", HttpStatus.CONFLICT),

    // ── Product ───────────────────────────────────
    CATEGORY_NOT_FOUND    ("PRODUCT_001", "Không tìm thấy danh mục",       HttpStatus.NOT_FOUND),
    BRAND_NOT_FOUND       ("PRODUCT_002", "Không tìm thấy thương hiệu",    HttpStatus.NOT_FOUND),
    PRODUCT_NOT_FOUND     ("PRODUCT_003", "Không tìm thấy sản phẩm",       HttpStatus.NOT_FOUND),
    INVALID_REQUEST       ("PRODUCT_004", "Dữ liệu yêu cầu không hợp lệ",  HttpStatus.BAD_REQUEST),

    // ── Cart ────────────────────────────────────────
    CART_ITEM_NOT_FOUND   ("CART_001", "Không tìm thấy sản phẩm trong giỏ hàng", HttpStatus.NOT_FOUND),

    // ── Banner ─────────────────────────────────────
    BANNER_NOT_FOUND      ("BANNER_001", "Không tìm thấy banner",           HttpStatus.NOT_FOUND),

    // ── Order ───────────────────────────────────────
    ORDER_NOT_FOUND       ("ORDER_001", "Không tìm thấy đơn hàng",         HttpStatus.NOT_FOUND),
    ORDER_STATUS_INVALID  ("ORDER_002", "Trạng thái đơn hàng không hợp lệ", HttpStatus.BAD_REQUEST),
    ORDER_ALREADY_PAID    ("ORDER_003", "Đơn hàng đã được thanh toán",     HttpStatus.BAD_REQUEST),
    ORDER_CREATION_FAILED ("ORDER_004", "Tạo đơn hàng thất bại",          HttpStatus.INTERNAL_SERVER_ERROR),
    ORDER_CANCEL_NOT_ALLOWED("ORDER_005", "Không thể hủy đơn hàng ở trạng thái này", HttpStatus.BAD_REQUEST),

    // ── Payment ─────────────────────────────────────
    PAYMENT_METHOD_NOT_SUPPORTED ("PAY_001", "Phương thức thanh toán không được hỗ trợ", HttpStatus.BAD_REQUEST),
    PAYMENT_FAILED               ("PAY_002", "Giao dịch thanh toán thất bại",            HttpStatus.PAYMENT_REQUIRED),
    PAYMENT_SIGNATURE_INVALID    ("PAY_003", "Chữ ký thanh toán không hợp lệ",           HttpStatus.BAD_REQUEST),

    // ── Messaging / RabbitMQ (Hữu ích cho xử lý bất đồng bộ) ─────────────────
    MESSAGE_PUBLISH_FAILED ("MQ_001", "Gửi tin nhắn đến hệ thống hàng đợi thất bại", HttpStatus.INTERNAL_SERVER_ERROR),
    ORDER_PROCESSING_DELAY ("MQ_002", "Đơn hàng đang được hệ thống xử lý, vui lòng chờ", HttpStatus.ACCEPTED),

    // ── Inventory & Stock ──────────────────────────
    VARIANT_NOT_FOUND       ("INVENTORY_001", "Không tìm thấy biến thể sản phẩm", HttpStatus.NOT_FOUND),
    INSUFFICIENT_STOCK      ("INVENTORY_002", "Số lượng tồn kho không đủ để đáp ứng", HttpStatus.BAD_REQUEST),
    INVALID_QUANTITY        ("INVENTORY_003", "Số lượng đặt hàng không hợp lệ", HttpStatus.BAD_REQUEST),
    OUT_OF_STOCK            ("INVENTORY_004", "Sản phẩm hiện đã hết hàng", HttpStatus.GONE),
    STOCK_HOLD_EXPIRED      ("INVENTORY_005", "Thời gian giữ hàng đã hết hạn", HttpStatus.REQUEST_TIMEOUT),
    STOCK_UPDATE_FAILED     ("INVENTORY_006", "Cập nhật kho hàng thất bại", HttpStatus.INTERNAL_SERVER_ERROR),
    SKU_ALREADY_EXISTS      ("INVENTORY_007", "Mã SKU đã tồn tại trên hệ thống", HttpStatus.CONFLICT),

    // ── Invoice ──────────────────────────────────────
    INVOICE_NOT_FOUND     ("INVOICE_001", "Không tìm thấy hóa đơn",                    HttpStatus.NOT_FOUND),
    INVOICE_ALREADY_PAID  ("INVOICE_002", "Hóa đơn đã được thanh toán",                HttpStatus.BAD_REQUEST),
    INVOICE_OVERDUE       ("INVOICE_003", "Hóa đơn đã quá hạn thanh toán",             HttpStatus.BAD_REQUEST),
    INVOICE_CREATE_FAILED ("INVOICE_004", "Tạo hóa đơn thất bại",                      HttpStatus.INTERNAL_SERVER_ERROR),
    INVOICE_STATUS_INVALID("INVOICE_005", "Trạng thái hóa đơn không hợp lệ",           HttpStatus.BAD_REQUEST),

    OTP_INVALID("OTP_001", "OTP không hợp lệ hoặc đã hết hạn", HttpStatus.UNAUTHORIZED);

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;
}
