package com.ttn.sporttn.modules.user.repository;

import com.ttn.sporttn.modules.user.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long> {
    Optional<Address> findByIdAndUserId(Long addressId, Long userId);
}
