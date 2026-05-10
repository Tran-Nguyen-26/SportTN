package com.ttn.sporttn.modules.user.service;

import com.ttn.sporttn.common.exception.BusinessException;
import com.ttn.sporttn.common.exception.ErrorCode;
import com.ttn.sporttn.modules.user.dto.request.ChangePasswordRequest;
import com.ttn.sporttn.modules.user.dto.request.LoginRequest;
import com.ttn.sporttn.modules.user.dto.request.RegisterRequest;
import com.ttn.sporttn.modules.user.dto.response.AuthResponse;
import com.ttn.sporttn.modules.user.dto.response.UserDetailResponse;
import com.ttn.sporttn.modules.user.dto.response.UserResponse;
import com.ttn.sporttn.modules.user.entity.*;
import com.ttn.sporttn.modules.user.repository.RefreshTokenRepository;
import com.ttn.sporttn.modules.user.repository.UserRepository;
import com.ttn.sporttn.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    @Value("${app.jwt.refresh-expiration}")
    private long refreshExpiration;

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    //Login
    public AuthResponse login(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> {
                    log.warn("[AUTH] Đăng nhập thất bại. Email Không tồn tại. email={}", loginRequest.getEmail());
                    return new BusinessException(ErrorCode.INVALID_CREDENTIALS);
            });

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPasswordHash())) {
            log.warn("[AUTH] Đăng nhập thất bại. Sai mật khẩu.");
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
        }

        if (user.getStatus() == UserStatus.BANNED) {
            log.warn("[AUTH] Truy cập bị chặn. Tài khoản bị khóa. email={}, status={}", loginRequest.getEmail(), user.getStatus());
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        UserResponse userResponse =
                UserResponse.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .phone(user.getPhone())
                        .role(user.getRole())
                        .status(user.getStatus())
                        .totalPoints(user.getTotalPoints())
                        .provider(user.getProvider())
                        .build();
        AuthResponse authResponse = generateTokenPair(user);
        authResponse.setUserResponse(userResponse);

        log.info("[AUTH] Đăng nhập thành công. email={}, user_id={}", loginRequest.getEmail(), user.getId());

        return authResponse;
    }

    private AuthResponse generateTokenPair(User user) {
        String accessToken = jwtService.generateAccessToken(user);
        String refreshTokenStr = jwtService.generateRefreshToken();
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setToken(refreshTokenStr);
        refreshToken.setExpiresAt(
                LocalDateTime.now().plusSeconds(refreshExpiration)
        );
        refreshToken.setCreatedAt(LocalDateTime.now());
        refreshTokenRepository.save(refreshToken);
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenStr)
                .tokenType("Bearer")
                .expiresIn(refreshExpiration)
                .build();
    }

    //Oauth
    @Transactional
    public AuthResponse processSocialLogin(String email, String name, String picture, String provider) {
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            String baseUsername = email.split("@")[0];

            String username = baseUsername;
            while (userRepository.existsByUsername(username)) {
                username = baseUsername + "_" + (int)(Math.random() * 9000 + 1000);
            }
            newUser.setUsername(username);
            newUser.setProvider(AuthProvider.valueOf(provider));
            newUser.setStatus(UserStatus.ACTIVE);
            newUser.setRole(UserRole.CUSTOMER);

            Profile profile = new Profile();
//            profile.setAvatarUrl(picture);
            profile.setUser(newUser);

            newUser.setProfile(profile);
            return userRepository.save(newUser);
        });

        AuthResponse authResponse = generateTokenPair(user);
        UserResponse userResponse = UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .status(user.getStatus())
                .totalPoints(user.getTotalPoints())
                .provider(user.getProvider())
                .build();
        authResponse.setUserResponse(userResponse);

        return authResponse;
    }

    //Đăng ký
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("[AUTH] Đăng ký thất bại. Email đã tồn tại. email={}", request.getEmail());
            throw new BusinessException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            log.warn("[AUTH] Đăng ký thất bại. Username đã tồn tại. username={}", request.getUsername());
            throw new BusinessException(ErrorCode.USERNAME_ALREADY_EXISTS);
        }

        if (userRepository.existsByPhone(request.getPhone())) {
            log.warn("[AUTH] Đăng ký thất bại. Số điện thoại đã được sử dụng. phone={}", request.getUsername());
            throw new BusinessException(ErrorCode.PHONE_ALREADY_EXISTS);
        }

        //User
        User user = new User();
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setPhone(request.getPhone());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        //Profile
        Profile profile = new Profile();
        profile.setUser(user);
        user.setProfile(profile);

        user = userRepository.save(user);

        log.warn(
                "[AUTH] Đăng ký thành công. email={}, username={}, userId={}",
                user.getEmail(), user.getUsername(), user.getId()
        );
    }

    public AuthResponse refreshToken(String refreshTokenStr) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(refreshTokenStr)
                .orElseThrow(() -> new BusinessException(ErrorCode.TOKEN_INVALID));

        if (refreshToken.isRevoked() || refreshToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BusinessException(ErrorCode.TOKEN_EXPIRED);
        }

        refreshToken.setRevoked(true);
        refreshTokenRepository.save(refreshToken);
        return generateTokenPair(refreshToken.getUser());
    }

    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
            throw new BusinessException(ErrorCode.PASSWORD_NOT_MATCH);
        }

        if (passwordEncoder.matches(request.getNewPassword(), user.getPasswordHash())) {
            throw new BusinessException(ErrorCode.SAME_PASSWORD);
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional
    public void logout(String refreshToken) {
        refreshTokenRepository.deleteByToken(refreshToken);
    }

    @Transactional
    public void updatePhone(Long userId, String newPhone) {
        if (newPhone == null || newPhone.trim().isEmpty()) {
            throw new RuntimeException("Số điện thoại không được để trống");
        }

        if (!newPhone.matches("^(0|\\+84)(\\d{9})$")) {
            throw new RuntimeException("Số điện thoại không đúng định dạng");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        if (userRepository.existsByPhoneAndIdNot(newPhone, userId)) {
            throw new RuntimeException("Số điện thoại này đã được sử dụng bởi tài khoản khác");
        }

        // 5. Cập nhật và lưu
        user.setPhone(newPhone);
        userRepository.save(user);
    }
}