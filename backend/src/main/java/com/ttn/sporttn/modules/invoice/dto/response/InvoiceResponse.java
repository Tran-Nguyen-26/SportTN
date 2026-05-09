package com.ttn.sporttn.modules.invoice.dto.response;

import com.ttn.sporttn.modules.invoice.entity.Invoice;
import com.ttn.sporttn.modules.order.entity.Order;
import com.ttn.sporttn.modules.user.entity.User;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Getter
@Setter
@Builder
public class InvoiceResponse {
    private Long       id;
    private String     invoiceNumber;   // INV-000001
    private String     orderId;         // order.orderCode
    private String     customer;        // user.fullName
    private String     initials;        // "NA" từ "Nguyễn An"
    private String     issueDate;
    private String     dueDate;
    private BigDecimal amount;          // invoice.finalAmount
    private String     paymentMethod;   // order.paymentMethod
    private String     status;          // invoice.status
    private String     customerEmail;
    private String     customerPhone;
    private String     customerAddress;
    private BigDecimal subtotal;
    private BigDecimal shippingFee;
    private BigDecimal discount;
    private BigDecimal taxAmount;
    private String     note;
    private List<InvoiceItemResponse> items;

    public static InvoiceResponse from(Invoice invoice) {
        Order order = invoice.getOrder();
        User user  = order.getUser();
        String name  = user.getFullname();

        return InvoiceResponse.builder()
                .id(invoice.getId())
                .invoiceNumber(invoice.getInvoiceNumber())
                .orderId(order.getOrderCode())
                .customer(name)
                .initials(buildInitials(name))
                .issueDate(invoice.getIssueDate().format(
                        DateTimeFormatter.ofPattern("dd/MM/yyyy")))
                .dueDate(invoice.getDueDate() != null
                        ? invoice.getDueDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))
                        : "—")
                .amount(invoice.getFinalAmount())
                .paymentMethod(order.getPaymentMethod())
                .status(invoice.getStatus())
                .customerEmail(user.getEmail())
                .customerPhone(order.getShippingInfo().getReceiverPhone())
                .customerAddress(order.getShippingInfo().getAddressFull())
                .subtotal(invoice.getSubtotal())
                .shippingFee(order.getShippingFee())
                .discount(order.getVoucherDiscount())
                .taxAmount(invoice.getTaxAmount())
                .note(invoice.getNote())
                .items(order.getItems().stream()
                        .map(InvoiceItemResponse::from)
                        .toList())
                .build();
    }

    private static String buildInitials(String fullName) {
        if (fullName == null || fullName.isBlank()) return "?";
        String[] parts = fullName.trim().split("\\s+");
        if (parts.length == 1) return parts[0].substring(0, 1).toUpperCase();
        return (parts[parts.length - 2].substring(0, 1)
                + parts[parts.length - 1].substring(0, 1)).toUpperCase();
    }
}
