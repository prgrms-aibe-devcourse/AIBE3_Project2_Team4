package org.team4.project.domain.payment.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.team4.project.domain.payment.dto.PaymentConfirmRequestDTO;
import org.team4.project.domain.payment.dto.PaymentResponseDTO;
import org.team4.project.domain.payment.dto.SavePaymentRequestDTO;
import org.team4.project.domain.payment.dto.UpdatePaymentMemoRequestDTO;
import org.team4.project.domain.payment.service.PaymentService;
import org.team4.project.global.exception.ErrorResponse;
import org.team4.project.global.security.CustomUserDetails;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/payments")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Payment API", description = "결제 기능 관련 API")
public class PaymentController {

    private final PaymentService paymentService;

    @Operation(
            summary = "결제 승인 요청 API",
            description = "실제 토스 결제 승인 API를 요청합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "결제 승인 요청 성공", content = @Content(schema = @Schema(implementation = PaymentResponseDTO.class))),
                    @ApiResponse(responseCode = "400", description = "결제 승인 요청 실패, 요청 데이터와 임시 저장된 데이터 불일치", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            }
    )
    @PostMapping("/confirm")
    public ResponseEntity<PaymentResponseDTO> confirmPayment(@AuthenticationPrincipal CustomUserDetails customUserDetails,
                                                             @Valid @RequestBody PaymentConfirmRequestDTO paymentConfirmRequestDTO) {
        PaymentResponseDTO response = paymentService.confirmPayment(paymentConfirmRequestDTO, customUserDetails.getEmail());
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "결제 요청 데이터 임시 저장 API", description = "결제를 요청하기 전에 서버에 임시로 저장합니다. 결제 승인 요청 전에 반드시 요청해야 하며, 결제 요청과 승인 사이에 데이터 무결성을 위함입니다.")
    @ApiResponse(responseCode = "200", description = "데이터 임시 저장 성공")
    @PostMapping("/save")
    public ResponseEntity<?> savePayment(@Valid @RequestBody SavePaymentRequestDTO savePaymentRequestDTO) {
        paymentService.savePayment(savePaymentRequestDTO);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "결제 내역 메모 수정 API")
    @ApiResponse(responseCode = "200", description = "메모 수정 성공")
    @PatchMapping("/{paymentKey}/memo")
    public ResponseEntity<?> updatePaymentMemo(@PathVariable("paymentKey") String paymentKey,
                                               @AuthenticationPrincipal CustomUserDetails customUserDetails,
                                               @Valid @RequestBody UpdatePaymentMemoRequestDTO updatePaymentMemoRequestDTO) {
        paymentService.updatePaymentMemo(paymentKey, updatePaymentMemoRequestDTO, customUserDetails.getEmail());
        return ResponseEntity.ok().build();
    }
}
