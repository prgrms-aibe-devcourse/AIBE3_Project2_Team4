package org.team4.project.global.websocket;

import lombok.RequiredArgsConstructor;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.team4.project.domain.chat.entity.ChatRoom;
import org.team4.project.domain.chat.repository.ChatRoomRepository;
import org.team4.project.domain.member.entity.Member;
import org.team4.project.domain.member.repository.MemberRepository;
import org.team4.project.global.security.CustomUserDetails;
import org.team4.project.global.security.jwt.JwtUtil;

import java.security.Principal;
import java.util.Objects;

@Component
@RequiredArgsConstructor
@Order(Ordered.HIGHEST_PRECEDENCE + 99)
public class StompHandler implements ChannelInterceptor {

    private final JwtUtil jwtUtil;
    private final MemberRepository memberRepository;
    private final ChatRoomRepository chatRoomRepository;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor == null) {
            throw new SecurityException("메시지 헤더를 찾을 수 없습니다.");
        }

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            String jwtToken = accessor.getFirstNativeHeader("Authorization");

            if (jwtToken != null && jwtToken.startsWith("Bearer ")) {
                jwtToken = jwtToken.substring(7);
            }

            if (jwtToken != null && !jwtUtil.isExpired(jwtToken)) {
                String email = jwtUtil.getEmail(jwtToken);
                Member member = memberRepository.findByEmail(email)
                        .orElseThrow(() -> new RuntimeException("인증된 사용자를 DB에서 찾을 수 없습니다."));

                CustomUserDetails userDetails = new CustomUserDetails(member);
                Authentication authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()
                );
                accessor.setUser(authentication);
            }
        } 
        else if (StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {
            String destination = accessor.getDestination();
            Principal principal = accessor.getUser();

            if (destination != null && destination.startsWith("/topic/canvas/")) {
                if (principal == null) {
                    throw new SecurityException("캔버스 구독은 인증된 사용자만 가능합니다.");
                }

                Authentication user = (Authentication) principal;
                CustomUserDetails userDetails = (CustomUserDetails) user.getPrincipal();

                String canvasIdStr = destination.substring("/topic/canvas/".length());
                Long canvasId = Long.parseLong(canvasIdStr);
                
                String email = userDetails.getEmail();
                Member member = memberRepository.findByEmail(email)
                        .orElseThrow(() -> new RuntimeException("사용자 정보를 찾을 수 없습니다: " + email));
                Long memberId = member.getId();

                ChatRoom chatRoom = chatRoomRepository.findById(canvasId)
                        .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 캔버스(채팅방) ID 입니다: " + canvasId));

                if (!Objects.equals(chatRoom.getClient().getId(), memberId) && !Objects.equals(chatRoom.getFreelancer().getId(), memberId)) {
                    throw new SecurityException("해당 캔버스에 접근할 권한이 없습니다.");
                }
            }
        }

        return message;
    }
}