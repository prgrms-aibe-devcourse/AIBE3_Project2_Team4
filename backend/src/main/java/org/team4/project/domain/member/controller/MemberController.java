package org.team4.project.domain.member.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.team4.project.domain.member.dto.MemberProfileResponseDTO;
import org.team4.project.domain.member.dto.MemberRoleRequestDTO;
import org.team4.project.domain.member.dto.MemberSignUpRequestDTO;
import org.team4.project.domain.member.dto.PaymentHistoryResponseDTO;
import org.team4.project.domain.member.service.AuthService;
import org.team4.project.domain.member.service.MemberService;
import org.team4.project.global.security.CustomUserDetails;
import org.team4.project.global.util.CookieUtil;

import java.util.List;

import static org.team4.project.global.security.jwt.JwtContents.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class MemberController {

    private final MemberService memberService;
    private final AuthService authService;

    @PostMapping("/register")
    public void singUp(@Valid @RequestBody MemberSignUpRequestDTO memberSignUpRequestDTO) {
        memberService.signUp(memberSignUpRequestDTO);
    }

    @PostMapping("/token/refresh")
    public void reissueToken(@CookieValue(name = TOKEN_TYPE_REFRESH, required = false) String refreshToken, HttpServletResponse response) {
        String newAccessToken = authService.reissueAccessToken(refreshToken);
        String newRefreshToken = authService.reissueRefreshToken(refreshToken);
        response.addHeader(AUTHORIZATION_HEADER, BEARER_PREFIX + newAccessToken);
        response.addCookie(CookieUtil.createCookie(TOKEN_TYPE_REFRESH, newRefreshToken, REFRESH_COOKIE_PATH, REFRESH_TOKEN_EXPIRE_SECONDS));
    }

    @PostMapping("/token/logout")
    public void logout(@CookieValue(name = TOKEN_TYPE_REFRESH, required = false) String refreshToken) {
        authService.logout(refreshToken);
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
      
    @GetMapping("/me/payments")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<List<PaymentHistoryResponseDTO>> getPaymentHistories(@AuthenticationPrincipal CustomUserDetails customUserDetails) {
        List<PaymentHistoryResponseDTO> paymentHistories = memberService.getPaymentHistories(customUserDetails.getEmail());
        return ResponseEntity.ok(paymentHistories);
    }
}
