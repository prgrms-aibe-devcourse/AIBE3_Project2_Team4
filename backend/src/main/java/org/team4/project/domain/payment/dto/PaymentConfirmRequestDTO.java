package org.team4.project.domain.payment.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

public record PaymentConfirmRequestDTO(
        @NotBlank @Schema(description = "결제의 키값, 결제를 식별하는 역할", requiredMode = REQUIRED, maxLength = 200)
        String paymentKey,

        @NotBlank
        @Pattern(regexp = "^[A-Za-z0-9_-]{6,64}$", message = "영문 대소문자, 숫자, 특수문자(-, _)만 허용하며 6~64자여야 합니다.")
        @Schema(description = "주문 번호, 주문할 결제를 식별하는 역할 (영문 대소문자, 숫자, 특수문자(-, _)로 이루어진 6자 이상 64자 이하의 문자열)", requiredMode = REQUIRED, minLength = 6, maxLength = 64)
        String orderId,

        @NotNull @PositiveOrZero @Schema(description = "결제할 금액", requiredMode = REQUIRED)
        Integer amount,

        String memo) {

    public PaymentConfirmDTO convert() {
        return new PaymentConfirmDTO(this.paymentKey, this.orderId, this.amount);
    }
}
