package com.ttn.sporttn.modules.user.repository;

import com.ttn.sporttn.modules.user.entity.Address;
import com.ttn.sporttn.modules.user.entity.User;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class AddressRepositoryCustomImpl implements AddressRepositoryCustom {

    private final EntityManager em;

    @Override
    public Optional<Address> findByIdAndUserId(Long addressId, Long userId) {
        String sql = "SELECT * FROM addresses WHERE id = ?1 AND user_id = ?2";

        List<Address> result = em.createNativeQuery(sql, Address.class)
                .setParameter(1, addressId)
                .setParameter(2, userId)
                .getResultList();

        return result.isEmpty() ? Optional.empty() : Optional.of(result.get(0));
    }

    @Override
    public List<Address> findByUserOrderByIsDefaultDescCreatedAtDesc(User user) {
        String sql = """
            SELECT * FROM addresses
            WHERE user_id = ?
            ORDER BY is_default DESC, created_at DESC
            """;

        return em.createNativeQuery(sql, Address.class)
                .setParameter(1, user.getId())
                .getResultList();
    }

    @Override
    public Optional<Address> findByUserIdAndIsDefaultTrue(Long userId) {
        String sql = "SELECT * FROM addresses WHERE user_id = ? AND is_default = true";

        List<Address> result = em.createNativeQuery(sql, Address.class)
                .setParameter(1, userId)
                .getResultList();

        return result.isEmpty() ? Optional.empty() : Optional.of(result.get(0));
    }

    @Override
    @Transactional
    public void unsetDefaultAddresses(Long userId) {
        String sql = "UPDATE addresses SET is_default = false WHERE user_id = ? AND is_default = true";

        em.createNativeQuery(sql)
                .setParameter(1, userId)
                .executeUpdate();
    }
}
