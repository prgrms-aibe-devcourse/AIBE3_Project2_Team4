package org.team4.project.global.security;

import jakarta.servlet.http.Cookie;
import lombok.RequiredArgsConstructor;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.team4.project.global.security.jwt.JwtUtil;

import static org.team4.project.global.security.jwt.JwtContents.*;


@RequiredArgsConstructor
public class CustomAuthenticationHandlers {

    private final JwtUtil jwtUtil;

    public AuthenticationSuccessHandler successHandler() {
        return (request, response, authentication) -> {
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            String email = userDetails.getEmail();
            String role = userDetails.getAuthorities().iterator().next().getAuthority().replaceFirst("^ROLE_", "");

            String accessToken = jwtUtil.createJwt(TOKEN_TYPE_ACCESS, email, role, ACCESS_TOKEN_EXPIRE_MILLIS);
            String refreshToken = jwtUtil.createJwt(TOKEN_TYPE_REFRESH, email, role, REFRESH_TOKEN_EXPIRE_MILLIS);

            response.addHeader(AUTHORIZATION_HEADER, BEARER_PREFIX + accessToken);
            response.addCookie(createRefreshCookie(refreshToken));
            response.setStatus(200);
        };
    }

    private Cookie createRefreshCookie(String token) {
        Cookie cookie = new Cookie(TOKEN_TYPE_REFRESH, token);
        cookie.setHttpOnly(true);
        cookie.setPath("/api/v1/auth/token/refresh");
        cookie.setMaxAge(REFRESH_TOKEN_EXPIRE_SECONDS);
        return cookie;
    }

    public AuthenticationFailureHandler failureHandler() {
        return (request, response, exception) -> {
            response.setStatus(401);
        };
    }
}
