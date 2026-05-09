package com.ttn.sporttn.modules.user.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class AddressRequest {
    @NotBlank(message = "Receiver name is required")
    @Size(max = 255, message = "Receiver name cannot exceed 255 characters")
    private String receiverName;

    @NotBlank(message = "Receiver phone is required")
    @Size(max = 20, message = "Receiver phone cannot exceed 20 characters")
    private String receiverPhone;

    @NotBlank(message = "Province is required")
    private String province;

    @NotBlank(message = "District is required")
    private String district;

    @NotBlank(message = "Ward is required")
    private String ward;

    @NotBlank(message = "Address detail is required")
    private String addressDetail;

    @NotNull(message = "isDefault is required")
    private Boolean isDefault;
}
