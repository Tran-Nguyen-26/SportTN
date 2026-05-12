package com.ttn.sporttn.modules.user.service;

import com.ttn.sporttn.common.exception.BusinessException;
import com.ttn.sporttn.common.exception.ErrorCode;
import com.ttn.sporttn.modules.user.dto.request.admin.AdminUserCreateRequest;
import com.ttn.sporttn.modules.user.dto.request.admin.AdminUserUpdateRequest;
import com.ttn.sporttn.modules.user.dto.request.admin.ToggleActiveRequest;
import com.ttn.sporttn.modules.user.dto.response.admin.ActivityLogResponse;
import com.ttn.sporttn.modules.user.dto.response.admin.AdminUserResponse;
import com.ttn.sporttn.modules.user.dto.response.admin.PermissionResponse;
import com.ttn.sporttn.modules.user.entity.Permission;
import com.ttn.sporttn.modules.user.entity.User;
import com.ttn.sporttn.modules.user.entity.UserRole;
import com.ttn.sporttn.modules.user.entity.UserStatus;
import com.ttn.sporttn.modules.user.repository.PermissionRepository;
import com.ttn.sporttn.modules.user.repository.UserRepository;
import com.ttn.sporttn.security.AuthUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PermissionRepository permissionRepository;
    private final ActivityLogService activityLogService;

    // ──────────────────────────────────────────────────────────────
    // READ
    // ──────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<AdminUserResponse> getAllAdminUsers() {
        log.info("[AdminUserService] Fetching all admin users");
        return userRepository.findAll()
                .stream()
                .filter(user -> !UserRole.CUSTOMER.name().equalsIgnoreCase(user.getRole().name()))
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AdminUserResponse getAdminUserById(Long id) {
        log.info("[AdminUserService] Fetching admin user by ID: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user với id: " + id));
        return convertToResponse(user);
    }

    // ──────────────────────────────────────────────────────────────
    // CREATE
    // ──────────────────────────────────────────────────────────────

    @Transactional
    public AdminUserResponse createAdminUser(AdminUserCreateRequest request) {
        log.info("[AdminUserService] Creating new admin user with email: {}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng: " + request.getEmail());
        }

        List<Permission> permissions = new ArrayList<>();
        if (request.getPermissionIds() != null && !request.getPermissionIds().isEmpty()) {
            permissions = new ArrayList<>(permissionRepository.findAllById(request.getPermissionIds()));
        }

        User newUser = User.builder()
                .username(request.getUsername())
                .fullname(request.getFullname())
                .email(request.getEmail())
                .phone(request.getPhone())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.valueOf(request.getRole()))
                .permissions(permissions)
                .status(UserStatus.valueOf(request.getStatus()))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        User saved = userRepository.save(newUser);
        log.info("[AdminUserService] Created admin user with ID: {}", saved.getId());
        return convertToResponse(saved);
    }

    // ──────────────────────────────────────────────────────────────
    // UPDATE
    // ──────────────────────────────────────────────────────────────

    @Transactional
    public AdminUserResponse updateAdminUser(Long id, AdminUserUpdateRequest request) {
        log.info("[AdminUserService] Updating admin user with ID: {}", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user với id: " + id));

        if (request.getUsername() != null) user.setUsername(request.getUsername());
        if (request.getFullname() != null) user.setFullname(request.getFullname());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getRole() != null) user.setRole(UserRole.valueOf(request.getRole()));
        if (request.getStatus() != null) user.setStatus(UserStatus.valueOf(request.getStatus()));

        if (request.getPermissionIds() != null) {
            List<Permission> updatedPermissions = new ArrayList<>(permissionRepository.findAllById(request.getPermissionIds()));
            user.setPermissions(updatedPermissions);
        }

        user.setUpdatedAt(LocalDateTime.now());

        User updated = userRepository.save(user);
        log.info("[AdminUserService] Updated admin user with ID: {}", updated.getId());
        return convertToResponse(updated);
    }

    // ──────────────────────────────────────────────────────────────
    // TOGGLE ACTIVE
    // ──────────────────────────────────────────────────────────────

    @Transactional
    public AdminUserResponse toggleActive(Long id, ToggleActiveRequest request) {
        log.info("[AdminUserService] Toggle active user ID: {}, status: {}", id, request.getActive());
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_REQUEST));
        user.setStatus(request.getActive() ? UserStatus.ACTIVE : UserStatus.INACTIVE);
        User updated = userRepository.save(user);
        return convertToResponse(updated);
    }

    // ──────────────────────────────────────────────────────────────
    // DELETE
    // ──────────────────────────────────────────────────────────────

    @Transactional
    public void deleteAdminUser(Long id) {
        log.info("[AdminUserService] Deleting admin user with ID: {}", id);

        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy user với id: " + id);
        }

        userRepository.deleteById(id);
        log.info("[AdminUserService] Deleted admin user with ID: {}", id);
    }

    // ──────────────────────────────────────────────────────────────
    // MAPPING HELPER
    // ──────────────────────────────────────────────────────────────

    private AdminUserResponse convertToResponse(User user) {
        List<PermissionResponse> permissionResponses = user.getPermissions().stream()
                .map(permission -> PermissionResponse.builder()
                        .id(permission.getId())
                        .name(permission.getName())
                        .description(permission.getDescription())
                        .build())
                .collect(Collectors.toList());

        Long currentUserId = AuthUtils.getCurrentUserId();
        List<ActivityLogResponse> activityLogResponses = activityLogService.getLogsByAdminId(user.getId());

        return AdminUserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullname(user.getFullname())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole() != null ? user.getRole().toString() : null)
                .permissions(permissionResponses)
                .status(user.getStatus() != null ? user.getStatus().toString() : null)
                .lastLogin(user.getLastLogin())
                .device(user.getLastDevice())
                .avatarColor(user.getAvatarColor())
                .isCurrentUser(user.getId().equals(currentUserId))
                .createdAt(user.getCreatedAt())
                .activityLog(activityLogResponses)
                .build();
    }
}