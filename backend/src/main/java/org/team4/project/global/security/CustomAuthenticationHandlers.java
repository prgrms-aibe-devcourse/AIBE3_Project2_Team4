package org.team4.project.global.security;

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
            String token = jwtUtil.createJwt(email, role);
            response.addHeader(AUTHORIZATION_HEADER, BEARER_PREFIX + token);
            response.setStatus(200);
        };
    }

    public AuthenticationFailureHandler failureHandler() {
        return (request, response, exception) -> {
            response.setStatus(401);
        };
    }
}
