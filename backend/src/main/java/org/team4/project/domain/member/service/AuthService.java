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
        return reissueTokenInternal(cookieToken, TOKEN_TYPE_ACCESS, ACCESS_TOKEN_EXPIRE_MILLIS);
    }

    public String reissueRefreshToken(String cookieToken) {
        return reissueTokenInternal(cookieToken, TOKEN_TYPE_REFRESH, REFRESH_TOKEN_EXPIRE_MILLIS);
    }

    private String reissueTokenInternal(String cookieToken, String tokenType, long expireMillis) {
        if (cookieToken == null || jwtUtil.isExpired(cookieToken) ||
                !jwtUtil.getType(cookieToken).equals(TOKEN_TYPE_REFRESH)) {
            throw new RuntimeException("Refresh token invalid");
        }

        String email = jwtUtil.getEmail(cookieToken);
        String role = jwtUtil.getRole(cookieToken);

        return jwtUtil.createJwt(tokenType, email, role, expireMillis);
    }
}
