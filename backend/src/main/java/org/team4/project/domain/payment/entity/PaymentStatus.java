package org.team4.project.domain.payment.entity;

public enum PaymentStatus {
    READY,
    IN_PROGRESS,
    WAITING_FOR_DEPOSIT,
    DONE,
    CANCELED,
    PARTIAL_CANCELED,
    ABORTED,
    EXPIRED;

    public static PaymentStatus of(String value) {
        for (PaymentStatus paymentStatus : values()) {
            if (paymentStatus.name().equalsIgnoreCase(value)) {
                return paymentStatus;
            }
        }

        throw new IllegalArgumentException("지원하지 않는 결제 상태입니다: " + value);
    }
}
