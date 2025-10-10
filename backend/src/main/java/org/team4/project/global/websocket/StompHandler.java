package org.team4.project.global.websocket;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.team4.project.domain.member.entity.Member;
import org.team4.project.domain.member.entity.MemberRole;
import org.team4.project.global.security.CustomUserDetails;
import org.team4.project.global.security.jwt.JwtUtil;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class StompHandler implements ChannelInterceptor {

    private final JwtUtil jwtUtil;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        // STOMP CONNECT 요청일 때 JWT 토큰 검증
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            String jwtToken = accessor.getFirstNativeHeader("Authorization");

            if (jwtToken != null && jwtToken.startsWith("Bearer ")) {
                jwtToken = jwtToken.substring(7);
            }

            // 토큰 유효성 검증
            if (jwtToken != null && !jwtUtil.isExpired(jwtToken)) {
                String email = jwtUtil.getEmail(jwtToken);
                String role = jwtUtil.getRole(jwtToken);

                // CustomUserDetails를 생성하기 위해, 토큰 정보로 임시 Member 객체를 생성합니다.
                Member member = Member.builder()
                        .email(email)
                        .memberRole(MemberRole.valueOf(role))
                        .build();
                CustomUserDetails userDetails = new CustomUserDetails(member);

                // 스프링 시큐리티 인증 토큰을 생성합니다.
                Authentication authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                
                // STOMP 세션에 인증 정보를 저장하여, 이후 @AuthenticationPrincipal로 접근할 수 있게 합니다.
                accessor.setUser(authentication);
            }
        }
        return message;
    }
}
