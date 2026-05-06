package com.ttn.sporttn.modules.user.service;


import com.ttn.sporttn.modules.user.dto.response.admin.PermissionResponse;
import com.ttn.sporttn.modules.user.entity.Permission;
import com.ttn.sporttn.modules.user.repository.PermissionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PermissionService {

    private final PermissionRepository permissionRepository;

    public List<PermissionResponse> getAllPermissions() {
        log.info("[PERMISSION] Lấy toàn bộ permissions");
        return permissionRepository.findAll()
                .stream()
                .map(p -> PermissionResponse.builder()
                        .id(p.getId())
                        .name(p.getName())
                        .value(p.getValue())
                        .description(p.getDescription())
                        .build())
                .collect(Collectors.toList());
    }

    public PermissionResponse getPermissionById(Long id) {
        log.info("[PERMISSION] Lấy chi tiết permission có ID: {}", id);

        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy quyền với ID: " + id));

        return PermissionResponse.builder()
                .id(permission.getId())
                .name(permission.getName())
                .value(permission.getValue())
                .description(permission.getDescription())
                .build();
    }

    public List<PermissionResponse> getPermissionsByIds(List<Long> ids) {
        log.info("[PERMISSION] Lấy danh sách permissions theo IDs: {}", ids);

        if (ids == null || ids.isEmpty()) {
            return List.of();
        }

        return permissionRepository.findAllById(ids)
                .stream()
                .map(p -> PermissionResponse.builder()
                        .id(p.getId())
                        .name(p.getName())
                        .value(p.getValue())
                        .description(p.getDescription())
                        .build())
                .collect(Collectors.toList());
    }
}


