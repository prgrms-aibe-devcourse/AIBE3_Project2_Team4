package org.team4.project.global.security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.team4.project.global.security.jwt.JwtUtil;
import org.team4.project.global.util.CookieUtil;

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
            response.addCookie(CookieUtil.createCookie(TOKEN_TYPE_REFRESH, refreshToken, REFRESH_REISSUE_PATH, REFRESH_TOKEN_EXPIRE_SECONDS));
            response.setStatus(200);
        };
    }

    public AuthenticationFailureHandler failureHandler() {
        return (request, response, exception) -> {
            response.setStatus(401);
        };
    }
}
