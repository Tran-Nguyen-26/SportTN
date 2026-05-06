package com.ttn.sporttn.modules.user.repository;

import com.ttn.sporttn.modules.user.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PermissionRepository extends JpaRepository<Permission, Long> {
}
