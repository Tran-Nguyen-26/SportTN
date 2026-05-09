package com.ttn.sporttn.modules.invoice.dto.response;

import com.ttn.sporttn.modules.order.entity.OrderItem;
import com.ttn.sporttn.modules.product.entity.Product;
import com.ttn.sporttn.modules.product.entity.ProductVariant;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
public class InvoiceItemResponse {
    private String     productName;
    private String     sku;
    private int        quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalPrice;

    public static InvoiceItemResponse from(OrderItem item) {
        ProductVariant variant = item.getProductVariant();
        Product product = variant.getProduct();

        return InvoiceItemResponse.builder()
                .productName(product.getName())
                .sku(variant.getSku())
                .quantity(item.getQuantity())
                .unitPrice(item.getPriceAtPurchase())
                .totalPrice(item.getPriceAtPurchase()
                        .multiply(BigDecimal.valueOf(item.getQuantity())))
                .build();
    }
}
