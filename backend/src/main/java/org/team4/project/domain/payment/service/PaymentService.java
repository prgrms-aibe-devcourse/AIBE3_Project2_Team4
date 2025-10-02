package org.team4.project.domain.payment.service;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.team4.project.domain.payment.dto.PaymentConfirmRequestDTO;
import org.team4.project.domain.payment.dto.SavePaymentRequestDTO;
import org.team4.project.domain.payment.exception.PaymentException;
import org.team4.project.domain.payment.infra.PaymentClient;
import org.team4.project.global.redis.RedisRepository;

import java.time.Duration;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PaymentService {

    private final PaymentClient paymentClient;
    private final RedisRepository redisRepository;

    public void confirmPayment(PaymentConfirmRequestDTO paymentConfirmRequestDTO) {
        String orderId = paymentConfirmRequestDTO.orderId();
        Integer amount = paymentConfirmRequestDTO.amount();

        verifyTempPayment(orderId, amount);

        JsonNode response = paymentClient.confirmPayment(paymentConfirmRequestDTO);
        redisRepository.deleteValue(generateKey(orderId));
        log.info("response = {}", response);
    }

    public void savePayment(SavePaymentRequestDTO savePaymentRequestDTO) {
        String orderId = savePaymentRequestDTO.orderId();
        Integer amount = savePaymentRequestDTO.amount();

        String key = generateKey(orderId);
        String value = amount.toString();
        redisRepository.setValue(key, value, Duration.ofMinutes(10));
    }

    private void verifyTempPayment(String orderId, Integer amount) {
        String key = generateKey(orderId);
        String storedValue = redisRepository.getValue(key);

        if (!Objects.equals(storedValue, String.valueOf(amount))) {
            log.debug("orderId: {}", orderId);
            throw new PaymentException("결제 금액 불일치 또는 임시 데이터가 존재하지 않습니다.");
        }
    }

    private String generateKey(String orderId) {
        return "payment:" + orderId;
    }
}
