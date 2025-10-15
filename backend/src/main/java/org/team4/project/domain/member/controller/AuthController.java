package org.team4.project.domain.member.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.team4.project.domain.member.dto.AuthTokensDTO;
import org.team4.project.domain.member.dto.request.*;
import org.team4.project.domain.member.service.AuthService;
import org.team4.project.domain.member.service.MemberService;
import org.team4.project.global.exception.ErrorResponse;
import org.team4.project.global.mail.MailService;
import org.team4.project.global.util.CookieUtil;

import static org.team4.project.global.security.jwt.JwtContents.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;
    private final MemberService memberService;
    private final MailService mailService;

    @Operation(
            summary = "로그인 API",
            description = "이메일과 비밀번호로 로그인하며, JWT access token과 refresh token을 발급합니다. \n\n" +
                    "- Access Token: Response Header 'Authorization: Bearer {JWT}' 형태로 발급\n" +
                    "- Refresh Token: HttpOnly 쿠키로 발급",
            responses = {
                    @ApiResponse(responseCode = "200", description = "로그인 성공"),
                    @ApiResponse(
                            responseCode = "401",
                            description = "이메일 또는 비밀번호가 잘못됨",
                            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
                    )
            }
    )
    @PostMapping("/login")
    public ResponseEntity<Void> login(@Valid @RequestBody LoginRequestDTO loginRequest,
                                      HttpServletResponse response) {
        AuthTokensDTO tokens = authService.login(loginRequest);

        response.addHeader(AUTHORIZATION_HEADER, BEARER_PREFIX + tokens.getAccessToken());
        response.addCookie(CookieUtil.createCookie(
                TOKEN_TYPE_REFRESH,
                tokens.getRefreshToken(),
                REFRESH_COOKIE_PATH,
                REFRESH_TOKEN_EXPIRE_SECONDS
        ));

        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "Access/Refresh 토큰 재발급",
            description = "리프레시 토큰을 이용해 새로운 액세스 토큰과 리프레시 토큰을 발급합니다. " +
                    "쿠키에 존재하는 refreshToken이 필요하며, 유효하지 않을 경우 401 응답이 반환됩니다."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "토큰 재발급 성공"),
            @ApiResponse(
                    responseCode = "401",
                    description = "리프레시 토큰이 없거나 유효하지 않음",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))
            )
    })
    @PostMapping("/token/refresh")
    public void reissueToken(
            @Parameter(description = "리프레시 토큰 쿠키", required = true)
            @CookieValue(name = TOKEN_TYPE_REFRESH, required = false) String refreshToken,
            HttpServletResponse response) {

        String newAccessToken = authService.reissueAccessToken(refreshToken);
        String newRefreshToken = authService.reissueRefreshToken(refreshToken);
        response.addHeader(AUTHORIZATION_HEADER, BEARER_PREFIX + newAccessToken);
        response.addCookie(CookieUtil.createCookie(
                TOKEN_TYPE_REFRESH,
                newRefreshToken,
                REFRESH_COOKIE_PATH,
                REFRESH_TOKEN_EXPIRE_SECONDS
        ));
    }

    @Operation(
            summary = "로그아웃 API",
            description = "쿠키에 저장된 refresh token을 무효화하여 로그아웃 처리합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "로그아웃 성공")
            }
    )
    @PostMapping("/token/logout")
    public void logout(@CookieValue(name = TOKEN_TYPE_REFRESH, required = false) String refreshToken) {
        authService.logout(refreshToken);
    }

    @Operation(
            summary = "이메일 인증 코드 요청 API",
            description = "회원가입 또는 이메일 확인을 위해 인증 코드를 요청합니다. " +
                    "이메일로 6자리 인증 코드가 전송됩니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "인증 코드 이메일 발송 성공"),
                    @ApiResponse(
                            responseCode = "400",
                            description = "이미 사용 중인 이메일이거나 카카오 소셜 로그인 이메일",
                            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
                    )
            }
    )
    @PostMapping("/email/verify/request")
    public ResponseEntity<String> requestEmailVerification(@Valid @RequestBody EmailVerificationRequestDTO request) {
        int code = memberService.generateEmailVerificationCode(request.getEmail());
        mailService.sendVerificationCode(request.getEmail(), code);
        return ResponseEntity.ok("인증 코드가 이메일로 전송되었습니다.");
    }

    @Operation(
            summary = "이메일 인증 코드 확인 API",
            description = "회원가입 또는 이메일 인증 과정에서 이메일로 발송된 6자리 인증 코드를 확인합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "이메일 인증 완료"),
                    @ApiResponse(
                            responseCode = "400",
                            description = "인증 코드가 없거나, 올바르지 않거나, 만료됨",
                            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
                    )
            }
    )
    @PostMapping("/email/verify/confirm")
    public ResponseEntity<String> confirmEmailVerification(@Valid @RequestBody EmailVerificationConfirmRequestDTO request) {
        memberService.verifyEmailCode(request.getEmail(), Integer.parseInt(request.getCode()));
        return ResponseEntity.ok("이메일 인증이 완료되었습니다.");
    }

    @Operation(
            summary = "비밀번호 재설정 링크 요청 API",
            description = "회원의 이메일을 입력하면 비밀번호 재설정 링크가 이메일로 전송됩니다. " +
                    "카카오 소셜 로그인으로 가입한 이메일은 재설정 불가합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "비밀번호 재설정 링크 발송 성공"),
                    @ApiResponse(
                            responseCode = "400",
                            description = "카카오 소셜 로그인 이메일이거나 비밀번호 재설정 불가",
                            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "해당 이메일로 가입된 회원이 없음",
                            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
                    )
            }
    )
    @PostMapping("/reset-password/request")
    public ResponseEntity<String> requestPasswordReset(@Valid @RequestBody PasswordResetRequestDTO request) {
        String token = memberService.generatePasswordResetToken(request.getEmail());
        mailService.sendPasswordResetLink(request.getEmail(), token);
        return ResponseEntity.ok("비밀번호 재설정 링크가 메일로 전송되었습니다.");
    }

    @Operation(
            summary = "비밀번호 재설정 완료 API",
            description = "회원이 이메일로 받은 재설정 링크와 새로운 비밀번호를 전달하면 비밀번호를 변경합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "비밀번호 재설정 성공"),
                    @ApiResponse(
                            responseCode = "400",
                            description = "재설정 링크가 유효하지 않거나 만료됨",
                            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "해당 이메일로 가입된 회원이 없음",
                            content = @Content(schema = @Schema(implementation = ErrorResponse.class))
                    )
            }
    )
    @PostMapping("/reset-password/confirm")
    public ResponseEntity<String> confirmPasswordReset(@Valid @RequestBody PasswordResetConfirmRequestDTO request) {
        memberService.resetPassword(request);
        return ResponseEntity.ok("비밀번호 재설정이 완료되었습니다");
    }
}
