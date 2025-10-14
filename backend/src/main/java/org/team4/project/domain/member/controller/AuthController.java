package org.team4.project.domain.member.controller;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.team4.project.domain.member.dto.AuthTokensDTO;
import org.team4.project.domain.member.dto.request.*;
import org.team4.project.domain.member.service.AuthService;
import org.team4.project.domain.member.service.MemberService;
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

    @PostMapping("/token/refresh")
    public void reissueToken(@CookieValue(name = TOKEN_TYPE_REFRESH, required = false) String refreshToken,
                             HttpServletResponse response) {
        String newAccessToken = authService.reissueAccessToken(refreshToken);
        String newRefreshToken = authService.reissueRefreshToken(refreshToken);
        response.addHeader(AUTHORIZATION_HEADER, BEARER_PREFIX + newAccessToken);
        response.addCookie(CookieUtil.createCookie(TOKEN_TYPE_REFRESH, newRefreshToken, REFRESH_COOKIE_PATH, REFRESH_TOKEN_EXPIRE_SECONDS));
    }

    @PostMapping("/token/logout")
    public void logout(@CookieValue(name = TOKEN_TYPE_REFRESH, required = false) String refreshToken) {
        authService.logout(refreshToken);
    }

    @PostMapping("/email/verify/request")
    public ResponseEntity<String> requestEmailVerification(@Valid @RequestBody EmailVerificationRequestDTO request) {
        int code = memberService.generateEmailVerificationCode(request.getEmail());
        mailService.sendVerificationCode(request.getEmail(), code);
        return ResponseEntity.ok("인증 코드가 이메일로 전송되었습니다.");
    }

    @PostMapping("/email/verify/confirm")
    public ResponseEntity<String> confirmEmailVerification(@Valid @RequestBody EmailVerificationConfirmRequestDTO request) {
        memberService.verifyEmailCode(request.getEmail(), Integer.parseInt(request.getCode()));
        return ResponseEntity.ok("이메일 인증이 완료되었습니다.");
    }

    @PostMapping("/reset-password/request")
    public ResponseEntity<String> requestPasswordReset(@Valid @RequestBody PasswordResetRequestDTO request) {
        String token = memberService.generatePasswordResetToken(request.getEmail());
        mailService.sendPasswordResetLink(request.getEmail(), token);
        return ResponseEntity.ok("비밀번호 재설정 링크가 메일로 전송되었습니다.");
    }

    @PostMapping("/reset-password/confirm")
    public ResponseEntity<String> confirmPasswordReset(@Valid @RequestBody PasswordResetConfirmRequestDTO request) {
        memberService.resetPassword(request);
        return ResponseEntity.ok("비밀번호 재설정이 완료되었습니다");
    }
}
