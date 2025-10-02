package org.team4.project.domain.payment.entity;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public enum PaymentMethod {

    CARD("카드"),
    VIRTUAL_ACCOUNT("가상계좌"),
    EASY_PAY("간편결제"),
    MOBILE_PHONE("휴대폰"),
    BANK_TRANSFER("계좌이체"),
    CULTURE_GIFT_CERTIFICATE("문화상품권"),
    BOOK_GIFT_CERTIFICATE("도서문화상품권"),
    GAME_GIFT_CERTIFICATE("게임문화상품권");

    private final String koreanName;

    public static PaymentMethod of(String value) {
        for (PaymentMethod paymentMethod : values()) {
            if (paymentMethod.koreanName.equalsIgnoreCase(value)) {
                return paymentMethod;
            }
        }

        throw new IllegalArgumentException("지원하지 않는 결제 방법입니다: " + value);
    }
}
