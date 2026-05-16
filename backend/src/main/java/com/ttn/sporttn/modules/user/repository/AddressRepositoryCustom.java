package com.ttn.sporttn.modules.user.repository;

import com.ttn.sporttn.modules.user.entity.Address;
import com.ttn.sporttn.modules.user.entity.User;

import java.util.List;
import java.util.Optional;

public interface AddressRepositoryCustom {
    Optional<Address> findByIdAndUserId(Long addressId, Long userId);

    List<Address> findByUserOrderByIsDefaultDescCreatedAtDesc(User user);

    Optional<Address> findByUserIdAndIsDefaultTrue(Long userId);

    void unsetDefaultAddresses(Long userId);
}
