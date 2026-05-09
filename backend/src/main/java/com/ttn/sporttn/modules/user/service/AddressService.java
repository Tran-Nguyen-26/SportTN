package com.ttn.sporttn.modules.user.service;

import com.ttn.sporttn.modules.user.dto.request.AddressRequest;
import com.ttn.sporttn.modules.user.dto.response.AddressResponse;
import com.ttn.sporttn.modules.user.entity.Address;
import com.ttn.sporttn.modules.user.entity.User;
import com.ttn.sporttn.modules.user.repository.AddressRepository;
import com.ttn.sporttn.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public List<AddressResponse> getMyAddresses(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return addressRepository.findByUserOrderByIsDefaultDescCreatedAtDesc(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public AddressResponse createAddress(Long userId, AddressRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Nếu set isDefault = true, unset các default khác
        if (Boolean.TRUE.equals(request.getIsDefault())) {
            addressRepository.unsetDefaultAddresses(userId);
        }

        Address address = Address.builder()
                .user(user)
                .receiverName(request.getReceiverName())
                .receiverPhone(request.getReceiverPhone())
                .province(request.getProvince())
                .district(request.getDistrict())
                .ward(request.getWard())
                .addressDetail(request.getAddressDetail())
                .isDefault(request.getIsDefault())
                .build();

        address = addressRepository.save(address);
        return mapToResponse(address);
    }

    @Transactional
    public AddressResponse updateAddress(Long userId, Long addressId, AddressRequest request) {
        Address address = getAddressByUserIdAndId(userId, addressId);

        // Nếu thay đổi isDefault = true, unset các default khác
        if (Boolean.TRUE.equals(request.getIsDefault()) && !address.getIsDefault()) {
            addressRepository.unsetDefaultAddresses(userId);
        }

        address.setReceiverName(request.getReceiverName());
        address.setReceiverPhone(request.getReceiverName());
        address.setProvince(request.getProvince());
        address.setDistrict(request.getDistrict());
        address.setWard(request.getWard());
        address.setAddressDetail(request.getAddressDetail());
        address.setIsDefault(request.getIsDefault());

        address = addressRepository.save(address);
        return mapToResponse(address);
    }

    @Transactional
    public void deleteAddress(Long userId, Long addressId) {
        Address address = getAddressByUserIdAndId(userId, addressId);
        addressRepository.delete(address);
    }

    @Transactional
    public AddressResponse setDefault(Long userId, Long addressId) {
        // Unset tất cả default addresses của user
        addressRepository.unsetDefaultAddresses(userId);

        // Set address này thành default
        Address address = getAddressByUserIdAndId(userId, addressId);
        address.setIsDefault(true);
        address = addressRepository.save(address);

        return mapToResponse(address);
    }

    private Address getAddressByUserIdAndId(Long userId, Long addressId) {
        return addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new RuntimeException("Address not found"));
    }

    private AddressResponse mapToResponse(Address address) {
        return AddressResponse.builder()
                .id(address.getId())
                .receiverName(address.getReceiverName())
                .receiverPhone(address.getReceiverPhone())
                .province(address.getProvince())
                .district(address.getDistrict())
                .ward(address.getWard())
                .addressDetail(address.getAddressDetail())
                .isDefault(address.getIsDefault())
                .createdAt(address.getCreatedAt())
                .updatedAt(address.getUpdatedAt())
                .build();
    }
}