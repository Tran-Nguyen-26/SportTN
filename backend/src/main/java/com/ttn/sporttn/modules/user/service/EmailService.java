package com.ttn.sporttn.modules.user.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("SportTN - Mã OTP đặt lại mật khẩu");
            helper.setText(buildEmailContent(otp), true); // true = HTML

            mailSender.send(message);
            log.info("[EMAIL] Gửi OTP thành công. email={}", toEmail);
        } catch (Exception e) {
            log.error("[EMAIL] Gửi OTP thất bại. email={}", toEmail, e);
            throw new RuntimeException("Gửi email thất bại");
        }
    }

    private String buildEmailContent(String otp) {
        return """
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 12px;">
                <h2 style="color: #1d4ed8;">SportTN</h2>
                <p>Bạn vừa yêu cầu đặt lại mật khẩu.</p>
                <p>Mã OTP của bạn là:</p>
                <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1d4ed8; text-align: center; padding: 16px; background: #eff6ff; border-radius: 8px;">
                    %s
                </div>
                <p style="color: #666; font-size: 13px; margin-top: 16px;">Mã có hiệu lực trong <strong>5 phút</strong>. Không chia sẻ mã này với bất kỳ ai.</p>
                <p style="color: #666; font-size: 13px;">Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
            </div>
        """.formatted(otp);
    }
}