package com.ttn.sporttn.modules.user.service;


import com.ttn.sporttn.common.exception.BusinessException;
import com.ttn.sporttn.common.exception.ErrorCode;
import com.ttn.sporttn.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomerService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final OtpStore otpStore;

    // ── Step 1: Gửi OTP ─────────────────────────────

    public void sendOtp(String email) {
        if (!userRepository.existsByEmail(email)) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }

        String otp = generateOtp();
        otpStore.save(email, otp, 5); // hết hạn sau 5 phút

        emailService.sendOtpEmail(email, otp);
        log.info("[FORGOT_PASSWORD] Đã gửi OTP. email={}", email);
    }

    // ── Step 2: Verify OTP ───────────────────────────

    public void verifyOtp(String email, String otp) {
        if (!otpStore.verify(email, otp)) {
            throw new BusinessException(ErrorCode.OTP_INVALID);
        }
        log.info("[FORGOT_PASSWORD] OTP hợp lệ. email={}", email);
    }


    @Transactional
    public void resetPassword(String email, String otp, String newPassword) {
        if (!otpStore.verify(email, otp)) {
            throw new BusinessException(ErrorCode.OTP_INVALID);
        }

        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        otpStore.remove(email);
        log.info("[FORGOT_PASSWORD] Đặt lại mật khẩu thành công. email={}", email);
    }

    // ── Helper ───────────────────────────────────────

    private String generateOtp() {
        return String.format("%06d", new Random().nextInt(999999));
    }
}
