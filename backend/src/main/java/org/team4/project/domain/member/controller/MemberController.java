package org.team4.project.domain.member.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.team4.project.domain.member.dto.MemberSignUpRequestDTO;
import org.team4.project.domain.member.service.AuthService;
import org.team4.project.domain.member.service.MemberService;
import org.team4.project.global.util.CookieUtil;

import java.util.Arrays;

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
    public void reissueToken(HttpServletRequest request, HttpServletResponse response) {
        String cookieToken = getRefreshToken(request);

        String accessToken = authService.reissueAccessToken(cookieToken);
        String refreshToken = authService.reissueRefreshToken(cookieToken);
        response.addHeader(AUTHORIZATION_HEADER, BEARER_PREFIX + accessToken);
        response.addCookie(CookieUtil.createCookie(TOKEN_TYPE_REFRESH, refreshToken, REFRESH_REISSUE_PATH, REFRESH_TOKEN_EXPIRE_SECONDS));
    }

    @PostMapping("/token/logout")
    public void logout(HttpServletRequest request) {
        String cookieToken = getRefreshToken(request);
        authService.logout(cookieToken);
    }

    private static String getRefreshToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        return Arrays.stream(cookies != null ? cookies : new Cookie[0])
                .filter(c -> c.getName().equals(TOKEN_TYPE_REFRESH))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }
}
