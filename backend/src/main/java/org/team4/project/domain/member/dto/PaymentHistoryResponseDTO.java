package org.team4.project.domain.member.dto;

import org.team4.project.domain.payment.entity.PaymentStatus;

import java.time.LocalDateTime;

public record PaymentHistoryResponseDTO(
        String paymentKey,
        Long freelancerId,
        Long serviceId,
        String serviceTitle,
        Integer price,
        String memo,
        LocalDateTime approvedAt,
        PaymentStatus paymentStatus) {
}
