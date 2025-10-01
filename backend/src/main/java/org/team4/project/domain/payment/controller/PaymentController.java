package org.team4.project.domain.payment.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.team4.project.domain.payment.dto.PaymentConfirmRequestDTO;
import org.team4.project.domain.payment.dto.SavePaymentRequestDTO;
import org.team4.project.domain.payment.service.PaymentService;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    /**
     * 결제 승인
     */
    //TODO : 사용자 ID와 서비스 ID를 전달받아 결제 완료 후 DB 저장
    @PostMapping("/confirm")
    public ResponseEntity<?> confirmPayment(@RequestBody PaymentConfirmRequestDTO paymentConfirmRequestDTO) {
        paymentService.confirmPayment(paymentConfirmRequestDTO);
        return ResponseEntity.ok().build();
    }

    /**
     * 결제 요청 전 요청할 데이터 임시 저장, 결제 승인보다 먼저 호출
     */
    @PostMapping("/save")
    public ResponseEntity<?> savePayment(@RequestBody SavePaymentRequestDTO savePaymentRequestDTO) {
        paymentService.savePayment(savePaymentRequestDTO);
        return ResponseEntity.ok().build();
    }
}
