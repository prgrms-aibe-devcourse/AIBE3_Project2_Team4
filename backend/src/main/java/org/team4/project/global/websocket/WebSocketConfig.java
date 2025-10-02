package org.team4.project.global.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // 클라이언트가 웹소켓 연결을 시작할 엔드포인트를 설정합니다.
        // SockJS는 웹소켓을 지원하지 않는 브라우저에서도 유사한 경험을 제공합니다.
        registry.addEndpoint("/ws-stomp")
                .setAllowedOriginPatterns("*") // 모든 출처에서의 연결을 허용합니다. (개발용)
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // 메시지 브로커가 /topic 프리픽스가 붙은 목적지의 클라이언트에게 메시지를 전달하도록 설정합니다.
        registry.enableSimpleBroker("/topic");

        // 클라이언트에서 서버로 메시지를 보낼 때 사용하는 프리픽스를 설정합니다.
        // 예를 들어, 클라이언트는 /app/chat.sendMessage 와 같은 경로로 메시지를 보냅니다.
        registry.setApplicationDestinationPrefixes("/app");
    }
}