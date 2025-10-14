package org.team4.project.domain.member.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.team4.project.domain.member.dto.request.*;
import org.team4.project.domain.member.dto.response.MemberProfileResponseDTO;
import org.team4.project.domain.member.dto.response.PaymentHistoryResponseDTO;
import org.team4.project.domain.member.service.MemberService;
import org.team4.project.global.security.CustomUserDetails;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class MemberController {

    private final MemberService memberService;

    @PostMapping("/register")
    public void signUp(@Valid @RequestBody MemberSignUpRequestDTO memberSignUpRequestDTO) {
        memberService.signUp(memberSignUpRequestDTO);
    }

    @GetMapping("/me")
    public ResponseEntity<MemberProfileResponseDTO> getProfile(@AuthenticationPrincipal CustomUserDetails customUserDetails) {
        MemberProfileResponseDTO profile = memberService.getProfile(customUserDetails.getEmail());
        return ResponseEntity.ok(profile);
    }

    @PostMapping("/role")
    public ResponseEntity<MemberProfileResponseDTO> setRole(@AuthenticationPrincipal CustomUserDetails customUserDetails,
                                                            @Valid @RequestBody MemberRoleRequestDTO memberRoleRequestDTO) {
        MemberProfileResponseDTO profile = memberService.setRole(customUserDetails.getEmail(), memberRoleRequestDTO.getRole());
        return ResponseEntity.ok(profile);
    }
      
    @GetMapping("/me/payments")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<List<PaymentHistoryResponseDTO>> getPaymentHistories(@AuthenticationPrincipal CustomUserDetails customUserDetails) {
        List<PaymentHistoryResponseDTO> paymentHistories = memberService.getPaymentHistories(customUserDetails.getEmail());
        return ResponseEntity.ok(paymentHistories);
    }

    @GetMapping("/check-nickname")
    public ResponseEntity<Boolean> checkNickname(@RequestParam("nickname") String nickname) {
        return ResponseEntity.ok(memberService.checkNickname(nickname));
    }
}
