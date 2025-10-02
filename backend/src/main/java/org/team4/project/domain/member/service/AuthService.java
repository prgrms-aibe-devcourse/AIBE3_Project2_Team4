package org.team4.project.domain.member.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.team4.project.global.security.jwt.JwtUtil;

import static org.team4.project.global.security.jwt.JwtContents.*;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtUtil jwtUtil;

    public String reissueAccessToken(String cookieToken) {
        if (cookieToken == null || jwtUtil.isExpired(cookieToken) ||
                !jwtUtil.getType(cookieToken).equals(TOKEN_TYPE_REFRESH)) {
            throw new RuntimeException("Refresh token invalid");
        }

        String email = jwtUtil.getEmail(cookieToken);
        String role = jwtUtil.getRole(cookieToken);

        return jwtUtil.createJwt(TOKEN_TYPE_ACCESS, email, role, ACCESS_TOKEN_EXPIRE_MILLIS);
    }
}
