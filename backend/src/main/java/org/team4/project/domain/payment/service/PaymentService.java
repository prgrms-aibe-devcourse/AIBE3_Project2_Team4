package org.team4.project.domain.payment.service;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.team4.project.domain.payment.dto.PaymentConfirmRequestDTO;
import org.team4.project.domain.payment.dto.PaymentResponseDTO;
import org.team4.project.domain.payment.dto.SavePaymentRequestDTO;
import org.team4.project.domain.payment.entity.Payment;
import org.team4.project.domain.payment.entity.PaymentMethod;
import org.team4.project.domain.payment.entity.PaymentStatus;
import org.team4.project.domain.payment.exception.PaymentException;
import org.team4.project.domain.payment.infra.PaymentClient;
import org.team4.project.domain.payment.repository.PaymentRepository;
import org.team4.project.global.redis.RedisRepository;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PaymentService {

    private static final ZoneId ZONE_ASIA_SEOUL = ZoneId.of("Asia/Seoul");

    private final PaymentClient paymentClient;
    private final RedisRepository redisRepository;
    private final PaymentRepository paymentRepository;

    @Transactional
    public PaymentResponseDTO confirmPayment(PaymentConfirmRequestDTO paymentConfirmRequestDTO) {
        String orderId = paymentConfirmRequestDTO.orderId();
        Integer amount = paymentConfirmRequestDTO.amount();

        verifyTempPayment(orderId, amount);

        JsonNode response = paymentClient.confirmPayment(paymentConfirmRequestDTO);

        paymentRepository.save(convertToEntity(response));
        redisRepository.deleteValue(generateKey(orderId));

        String receiptUrl = response.get("receipt").get("url").asText(null);
        return new PaymentResponseDTO(receiptUrl);
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

    private Payment convertToEntity(JsonNode response) {
        String orderId = response.get("orderId").asText();
        String paymentKey = response.get("paymentKey").asText();

        PaymentStatus paymentStatus = PaymentStatus.of(response.get("status").asText());
        PaymentMethod paymentMethod = PaymentMethod.of(response.get("method").asText());

        LocalDateTime requestedAt = parseToLocalDateTime(response.get("requestedAt").asText());
        LocalDateTime approvedAt = parseToLocalDateTime(response.get("approvedAt").asText(null));

        int totalAmount = response.get("totalAmount").asInt();

        return Payment.builder()
                      .paymentKey(paymentKey)
                      .orderId(orderId)
                      .paymentMethod(paymentMethod)
                      .paymentStatus(paymentStatus)
                      .requestedAt(requestedAt)
                      .approvedAt(approvedAt)
                      .totalAmount(totalAmount)
                      .build();
    }

    private LocalDateTime parseToLocalDateTime(String timestamp) {
        if (!StringUtils.hasText(timestamp)) {
            return null;
        }

        return OffsetDateTime.parse(timestamp).atZoneSameInstant(ZONE_ASIA_SEOUL).toLocalDateTime();
    }

    private String generateKey(String orderId) {
        return "payment:" + orderId;
    }
}
