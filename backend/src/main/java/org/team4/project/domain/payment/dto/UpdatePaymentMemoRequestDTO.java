package org.team4.project.domain.payment.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;

public record UpdatePaymentMemoRequestDTO(
        @Schema(description = "메모 내용", maxLength = 200)
        @Size(max = 200, message = "최대 메모 길이는 200자 입니다.")
        String memo) {
}
