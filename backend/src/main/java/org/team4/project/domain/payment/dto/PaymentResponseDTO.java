package org.team4.project.domain.payment.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.NOT_REQUIRED;

//TODO : 더 자세한 정보 필요하면 필드 추가
public record PaymentResponseDTO(

        @Schema(description = "발행된 영수증 정보", requiredMode = NOT_REQUIRED)
        String receiptUrl) {
}
