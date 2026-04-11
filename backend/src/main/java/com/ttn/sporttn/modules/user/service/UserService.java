package com.ttn.sporttn.modules.user.service;

import com.ttn.sporttn.common.exception.BusinessException;
import com.ttn.sporttn.common.exception.ErrorCode;
import com.ttn.sporttn.modules.user.dto.request.LoginRequest;
import com.ttn.sporttn.modules.user.dto.request.RegisterRequest;
import com.ttn.sporttn.modules.user.dto.response.AuthResponse;
import com.ttn.sporttn.modules.user.dto.response.UserDetailResponse;
import com.ttn.sporttn.modules.user.entity.*;
import com.ttn.sporttn.modules.user.repository.RefreshTokenRepository;
import com.ttn.sporttn.modules.user.repository.UserRepository;
import com.ttn.sporttn.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
        AuthResponse authResponse = generateTokenPair(user);
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
            newUser.setUsername(UUID.randomUUID().toString());
            newUser.setProvider(AuthProvider.valueOf(provider));
            newUser.setStatus(UserStatus.ACTIVE);
            newUser.setRole(UserRole.CUSTOMER);

            Profile profile = new Profile();
            profile.setFullName(name);
//            profile.setAvatarUrl(picture);
            profile.setUser(newUser);

            newUser.setProfile(profile);
            return userRepository.save(newUser);
        });

        return generateTokenPair(user);
    }

    //Đăng ký
    public UserDetailResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("[AUTH] Đăng ký thất bại. Email đã tồn tại. email={}", request.getEmail());
            throw new BusinessException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            log.warn("[AUTH] Đăng ký thất bại. Username đã tồn tại. username={}", request.getUsername());
            throw new BusinessException(ErrorCode.USERNAME_ALREADY_EXISTS);
        }

        //User
        User user = new User();
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
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
        return UserDetailResponse.builder()
                .email(request.getEmail())
                .username(request.getUsername())
                .role(UserRole.CUSTOMER.name())
                .status(user.getStatus().name())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
