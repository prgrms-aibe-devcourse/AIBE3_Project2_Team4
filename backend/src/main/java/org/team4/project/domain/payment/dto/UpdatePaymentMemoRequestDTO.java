package org.team4.project.domain.payment.dto;

import jakarta.validation.constraints.Size;

public record UpdatePaymentMemoRequestDTO(@Size(max = 200, message = "최대 메모 길이는 200자 입니다.") String memo) {
}
