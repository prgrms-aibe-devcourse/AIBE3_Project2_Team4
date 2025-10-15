package org.team4.project.domain.member.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.team4.project.domain.member.dto.AuthTokensDTO;
import org.team4.project.domain.member.dto.request.LoginRequestDTO;
import org.team4.project.domain.member.exception.LoginException;
import org.team4.project.domain.member.exception.RefreshTokenException;
import org.team4.project.global.redis.RedisRepository;
import org.team4.project.global.security.CustomUserDetails;
import org.team4.project.global.security.jwt.JwtContents;
import org.team4.project.global.security.jwt.JwtUtil;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtUtil jwtUtil;
    private final RedisRepository redisRepository;
    private final AuthenticationManager authenticationManager;

    public String reissueAccessToken(String refreshToken) {
        validateRefreshToken(refreshToken);
        return jwtUtil.createJwt(JwtContents.TOKEN_TYPE_ACCESS,
                jwtUtil.getEmail(refreshToken),
                jwtUtil.getRole(refreshToken),
                JwtContents.ACCESS_TOKEN_EXPIRE_MILLIS);
    }

    public String reissueRefreshToken(String oldRefreshToken) {
        validateRefreshToken(oldRefreshToken);

        redisRepository.deleteValue(oldRefreshToken);

        String newRefreshToken = jwtUtil.createJwt(JwtContents.TOKEN_TYPE_REFRESH,
                jwtUtil.getEmail(oldRefreshToken),
                jwtUtil.getRole(oldRefreshToken),
                JwtContents.REFRESH_TOKEN_EXPIRE_MILLIS);

        redisRepository.setValue(newRefreshToken, "valid", Duration.ofSeconds(JwtContents.REFRESH_TOKEN_EXPIRE_SECONDS));

        return newRefreshToken;
    }

    public AuthTokensDTO login(LoginRequestDTO request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            String email = userDetails.getEmail();
            String role = userDetails.getAuthorities().iterator().next().getAuthority().replaceFirst("^ROLE_", "");

            String accessToken = jwtUtil.createJwt(JwtContents.TOKEN_TYPE_ACCESS, email, role, JwtContents.ACCESS_TOKEN_EXPIRE_MILLIS);
            String refreshToken = jwtUtil.createJwt(JwtContents.TOKEN_TYPE_REFRESH, email, role, JwtContents.REFRESH_TOKEN_EXPIRE_MILLIS);

            redisRepository.setValue(refreshToken, "valid", Duration.ofSeconds(JwtContents.REFRESH_TOKEN_EXPIRE_SECONDS));

            return new AuthTokensDTO(accessToken, refreshToken);

        } catch (Exception e) {
            throw new LoginException("이메일 또는 비밀번호가 잘못되었습니다.");
        }
    }

    public void logout(String refreshToken) {
        if (refreshToken != null) {
            redisRepository.deleteValue(refreshToken);
        }
    }

    private void validateRefreshToken(String refreshToken) {
        if (refreshToken == null) {
            throw new RefreshTokenException("토큰이 존재하지 않습니다.");
        }

        try {
            if (jwtUtil.isExpired(refreshToken) ||
                    !jwtUtil.getType(refreshToken).equals(JwtContents.TOKEN_TYPE_REFRESH) ||
                    redisRepository.getValue(refreshToken) == null) {
                throw new RefreshTokenException("토큰이 유효하지 않습니다.");
            }
        } catch (Exception e) {
            throw new RefreshTokenException("토큰이 유효하지 않습니다.");
        }
    }
}
