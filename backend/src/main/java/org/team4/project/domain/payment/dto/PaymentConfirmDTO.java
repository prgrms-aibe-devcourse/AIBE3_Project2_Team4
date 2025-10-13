package org.team4.project.domain.payment.dto;

public record PaymentConfirmDTO(
        String paymentKey,
        String orderId,
        Integer amount) {
}
