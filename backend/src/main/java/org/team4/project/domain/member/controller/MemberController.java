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
        Cookie[] cookies = request.getCookies();
        String cookieToken = Arrays.stream(cookies != null ? cookies : new Cookie[0])
                .filter(c -> c.getName().equals(TOKEN_TYPE_REFRESH))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);

        try {
            String accessToken = authService.reissueAccessToken(cookieToken);
            response.addHeader(AUTHORIZATION_HEADER, BEARER_PREFIX + accessToken);
        } catch (RuntimeException e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        }
    }
}
