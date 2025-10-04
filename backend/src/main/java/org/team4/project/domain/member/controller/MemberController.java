package org.team4.project.domain.member.controller;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.team4.project.domain.member.dto.MemberSignUpRequestDTO;
import org.team4.project.domain.member.service.AuthService;
import org.team4.project.domain.member.service.MemberService;
import org.team4.project.global.util.CookieUtil;

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
}
