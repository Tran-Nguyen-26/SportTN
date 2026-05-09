package com.ttn.sporttn.modules.order.dto.response;

import com.ttn.sporttn.modules.order.entity.ShippingInfo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShippingInfoResponse {

    private Long id;
    private String receiverName;
    private String receiverPhone;
    private String carrier;
    private String trackingNumber;
    private String addressFull;
    private LocalDateTime estimatedDelivery;
    private LocalDateTime actualDelivery;

    public static ShippingInfoResponse from(ShippingInfo shippingInfo) {
        if (shippingInfo == null) {
            return null;
        }

        return ShippingInfoResponse.builder()
            .id(shippingInfo.getId())
            .receiverName(shippingInfo.getReceiverName())
            .receiverPhone(shippingInfo.getReceiverPhone())
            .carrier(shippingInfo.getCarrier())
            .trackingNumber(shippingInfo.getTrackingNumber())
            .addressFull(shippingInfo.getAddressFull())
            .estimatedDelivery(shippingInfo.getEstimatedDelivery())
            .actualDelivery(shippingInfo.getActualDelivery())
            .build();
    }
}
