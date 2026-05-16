package com.ttn.sporttn.modules.user.repository;

import com.ttn.sporttn.modules.user.entity.Address;
import com.ttn.sporttn.modules.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Long>, AddressRepositoryCustom{
    Optional<Address> findByIdAndUserId(Long addressId, Long userId);

    List<Address> findByUserOrderByIsDefaultDescCreatedAtDesc(User user);

    Optional<Address> findByUserIdAndIsDefaultTrue(Long userId);

    @Modifying
    @Query("UPDATE Address a SET a.isDefault = false WHERE a.user.id = :userId AND a.isDefault = true")
    void unsetDefaultAddresses(@Param("userId") Long userId);
}
