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
    USERNAME_ALREADY_EXISTS("USER_006", "Tên người dùng đã được sử dụng", HttpStatus.CONFLICT);

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;
}
