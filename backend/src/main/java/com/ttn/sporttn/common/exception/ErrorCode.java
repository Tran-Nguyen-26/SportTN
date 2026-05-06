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
    
    // ── Inventory ──────────────────────────────────
    VARIANT_NOT_FOUND     ("INVENTORY_001", "Không tìm thấy biến thể sản phẩm", HttpStatus.NOT_FOUND),
    INSUFFICIENT_STOCK    ("INVENTORY_002", "Số lượng tồn kho không đủ",    HttpStatus.BAD_REQUEST),
    INVALID_QUANTITY      ("INVENTORY_003", "Số lượng không hợp lệ",        HttpStatus.BAD_REQUEST),

    // ── Cart ────────────────────────────────────────
    CART_ITEM_NOT_FOUND   ("CART_001", "Không tìm thấy sản phẩm trong giỏ hàng", HttpStatus.NOT_FOUND),

    // ── Banner ─────────────────────────────────────
    BANNER_NOT_FOUND      ("BANNER_001", "Không tìm thấy banner",           HttpStatus.NOT_FOUND);

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;
}
