package org.team4.project.domain.member.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
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
import org.team4.project.global.exception.ErrorResponse;
import org.team4.project.global.security.CustomUserDetails;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class MemberController {

    private final MemberService memberService;

    @Operation(
            summary = "회원가입 API",
            description = "인증된 이메일로 회원가입을 진행합니다. \n\n" +
                    "- 이메일은 사전에 이메일 인증이 완료되어야 합니다.\n" +
                    "- 비밀번호는 8~20자, 닉네임은 2~20자, 역할은 CLIENT 또는 FREELANCER이어야 합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "회원가입 성공"),
                    @ApiResponse(
                            responseCode = "400",
                            description = "이미 사용중인 이메일/닉네임이거나 인증되지 않은 이메일",
                            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
                    )
            }
    )
    @PostMapping("/register")
    public void signUp(@Valid @RequestBody MemberSignUpRequestDTO memberSignUpRequestDTO) {
        memberService.signUp(memberSignUpRequestDTO);
    }

    @Operation(
            summary = "내 프로필 조회 API",
            description = "로그인한 회원의 간편 프로필 정보를 조회합니다. \n\n" +
                    "- 인증이 필요한 API로, Access Token이 필요합니다.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "프로필 조회 성공",
                            content = @Content(schema = @Schema(implementation = MemberProfileResponseDTO.class))
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "존재하지 않는 유저",
                            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
                    )
            }
    )
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/me")
    public ResponseEntity<MemberProfileResponseDTO> getProfile(@AuthenticationPrincipal CustomUserDetails customUserDetails) {
        MemberProfileResponseDTO profile = memberService.getProfile(customUserDetails.getEmail());
        return ResponseEntity.ok(profile);
    }

    @Operation(
            summary = "회원 역할(Role) 설정 API",
            description = "소셜로그인으로 가입한 회원의 역할을 설정합니다. \n\n" +
                    "- 인증이 필요한 API로, Access Token이 필요합니다.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "역할 설정 성공",
                            content = @Content(schema = @Schema(implementation = MemberProfileResponseDTO.class))
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "존재하지 않는 유저",
                            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
                    )
            }
    )
    @SecurityRequirement(name = "bearerAuth")
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


    @Operation(
            summary = "닉네임 중복 확인 API",
            description = "입력한 닉네임이 이미 사용 중인지 확인합니다.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "닉네임 사용 가능 여부 반환 (true: 사용 가능, false: 사용 불가)",
                            content = @Content(schema = @Schema(implementation = Boolean.class))
                    )
            }
    )
    @GetMapping("/check-nickname")
    public ResponseEntity<Boolean> checkNickname(@RequestParam("nickname") String nickname) {
        return ResponseEntity.ok(memberService.checkNickname(nickname));
    }
}
