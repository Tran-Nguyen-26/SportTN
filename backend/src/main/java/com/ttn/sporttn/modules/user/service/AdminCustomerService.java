package com.ttn.sporttn.modules.user.service;

import com.ttn.sporttn.common.exception.BusinessException;
import com.ttn.sporttn.common.exception.ErrorCode;
import com.ttn.sporttn.modules.order.entity.Order;
import com.ttn.sporttn.modules.order.repository.OrderRepository;
import com.ttn.sporttn.modules.user.dto.request.admin.ToggleActiveRequest;
import com.ttn.sporttn.modules.user.dto.request.admin.UpdateCustomerRequest;
import com.ttn.sporttn.modules.user.dto.response.admin.AdminCustomerResponse;
import com.ttn.sporttn.modules.user.dto.response.admin.CustomerOrderResponse;
import com.ttn.sporttn.modules.user.entity.Profile;
import com.ttn.sporttn.modules.user.entity.User;
import com.ttn.sporttn.modules.user.entity.UserRole;
import com.ttn.sporttn.modules.user.entity.UserStatus;
import com.ttn.sporttn.modules.user.repository.AddressRepository;
import com.ttn.sporttn.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminCustomerService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final AddressRepository addressRepository;

    public Page<AdminCustomerResponse> getAllCustomers(Pageable pageable, String keyword, String status) {
        Specification<User> spec = Specification.where(
                (root, q, cb) -> cb.equal(root.get("role"), UserRole.CUSTOMER)
        );

        if (StringUtils.hasText(keyword)) {
            spec = spec.and((root, q, cb) -> cb.or(
                    cb.like(cb.lower(root.get("fullname")), "%" + keyword.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("email")),    "%" + keyword.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("phone")),    "%" + keyword.toLowerCase() + "%")
            ));
        }

        if (StringUtils.hasText(status)) {
            spec = spec.and((root, q, cb) ->
                    cb.equal(root.get("status"), UserStatus.valueOf(status)));
        }

        return userRepository.findAll(spec, pageable).map(AdminCustomerResponse::from);
    }

    @Transactional(readOnly = true)
    public AdminCustomerResponse getCustomerById(Long id) {
        log.info("[AdminCustomerService] Fetching customer by ID: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (!UserRole.CUSTOMER.equals(user.getRole())) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }

        return convertToResponse(user, true); // load orderHistory cho detail
    }

//    @Transactional
//    public AdminCustomerResponse toggleActive(Long id, ToggleActiveRequest request) {
//        log.info("[AdminCustomerService] Toggle active customer ID: {}, status: {}", id, request.getStatus());
//
//        User user = userRepository.findById(id)
//                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
//
//        if (!UserRole.CUSTOMER.equals(user.getRole())) {
//            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
//        }
//
//        user.setStatus(UserStatus.valueOf(request.getStatus()));
//        user.setUpdatedAt(LocalDateTime.now());
//
//        return convertToResponse(userRepository.save(user), false);
//    }

    @Transactional
    public void deleteCustomer(Long id) {
        log.info("[AdminCustomerService] Deleting customer ID: {}", id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (!UserRole.CUSTOMER.equals(user.getRole())) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }

        userRepository.deleteById(id);
    }

    @Transactional
    public AdminCustomerResponse updateCustomer(Long id, UpdateCustomerRequest request) {
        log.info("[AdminCustomerService] Updating customer ID: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (!UserRole.CUSTOMER.equals(user.getRole())) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }

        if (request.getFullName() != null) user.setFullname(request.getFullName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getStatus() != null) {
            user.setStatus(UserStatus.valueOf(request.getStatus()));
        }
        user.setUpdatedAt(LocalDateTime.now());

        Profile profile = user.getProfile();
        if (profile == null) {
            profile = new Profile();
            profile.setUser(user);
            user.setProfile(profile);
        }

        if (request.getGender() != null) profile.setGender(request.getGender());
        if (request.getNote() != null) profile.setNote(request.getNote());
        if (request.getBirthday() != null && !request.getBirthday().isEmpty()) {
            try {
                profile.setBirthday(java.time.LocalDate.parse(request.getBirthday()));
            } catch (Exception e) {
                log.error("Error parsing birthday: {}", request.getBirthday());
            }
        }

        User savedUser = userRepository.save(user);

        return convertToResponse(savedUser, false);
    }

    // ── MAPPING ───────────────────────────────────────────────────

    private AdminCustomerResponse convertToResponse(User user, boolean includeOrders) {
        Profile profile = user.getProfile();

        // Initials
        String username = user.getUsername() != null ? user.getUsername() : "";
        String initials = username.length() >= 2
                ? username.substring(0, 2).toUpperCase()
                : username.toUpperCase();

        String address = addressRepository.findByUserIdAndIsDefaultTrue(user.getId())
                .map(a -> String.join(", ",
                        a.getAddressDetail() != null ? a.getAddressDetail() : "",
                        a.getWard()     != null ? a.getWard()     : "",
                        a.getDistrict() != null ? a.getDistrict() : "",
                        a.getProvince() != null ? a.getProvince() : ""
                ).replaceAll("^,\\s*|,\\s*$|,\\s*,", ", ").trim())
                .orElse(null);

        // Orders
        List<Order> orders = orderRepository.findByUserId(user.getId());
        long totalOrders = orders.size();
        BigDecimal totalSpent = orders.stream()
                .map(Order::getFinalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<CustomerOrderResponse> orderHistory = null;
        if (includeOrders) {
            orderHistory = orders.stream()
                    .map(o -> CustomerOrderResponse.builder()
                            .id(o.getId())
                            .orderCode(o.getOrderCode())
                            .finalAmount(o.getFinalAmount())
                            .status(o.getStatus())
                            .paymentStatus(o.getPaymentStatus())
                            .itemCount(o.getItems() != null ? o.getItems().size() : 0)
                            .createdAt(o.getCreatedAt())
                            .build())
                    .collect(Collectors.toList());
        }

        return AdminCustomerResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullname())
                .initials(initials)
                .email(user.getEmail())
                .phone(user.getPhone())
                .totalOrders(totalOrders)
                .totalSpent(totalSpent)
                .joinDate(user.getCreatedAt())
                .status(user.getStatus() != null ? user.getStatus().toString() : null)
                .address(address)
                .gender(profile != null ? profile.getGender() : null)
                .birthday(profile != null && profile.getBirthday() != null
                        ? profile.getBirthday().toString() : null)
                .note(profile != null ? profile.getNote() : null)
                .orderHistory(orderHistory)
                .build();
    }
}