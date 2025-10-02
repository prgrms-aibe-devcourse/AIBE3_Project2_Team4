package org.team4.project.domain.payment.service;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.team4.project.domain.payment.dto.PaymentConfirmRequestDTO;
import org.team4.project.domain.payment.dto.SavePaymentRequestDTO;
import org.team4.project.domain.payment.infra.PaymentClient;
import org.team4.project.global.redis.RedisRepository;

import java.time.Duration;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PaymentService {

    private final PaymentClient paymentClient;
    private final RedisRepository redisRepository;

    public void confirmPayment(PaymentConfirmRequestDTO paymentConfirmRequestDTO) {
        //TODO : 레디스(or 세션)에 임시 저장한 값과 일치하는지 판단 후 결제 승인 요청

        JsonNode response = paymentClient.confirmPayment(paymentConfirmRequestDTO);
        log.info("response = {}", response);
    }

    public void savePayment(SavePaymentRequestDTO savePaymentRequestDTO) {
        String orderId = savePaymentRequestDTO.orderId();
        Integer amount = savePaymentRequestDTO.amount();

        String key = "payment:" + orderId;
        String value = amount.toString();
        redisRepository.setValue(key, value, Duration.ofMinutes(10));
    }
}
