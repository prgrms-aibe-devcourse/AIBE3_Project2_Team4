package org.team4.project.domain.payment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record PaymentConfirmRequestDTO(
        @NotBlank String paymentKey,
        @NotBlank String orderId,
        @NotNull @PositiveOrZero Integer amount) {
}
