package org.team4.project.domain.chat.dto;

import org.team4.project.domain.chat.entity.ChatRoom;

public record ChatRoomResponseDto(
        Long id,
        String name,
        Long clientId,
        String clientNickname,
        Long freelancerId,
        String freelancerNickname
) {
    // 정적 팩토리 메소드
    public static ChatRoomResponseDto from(ChatRoom entity) {
        return new ChatRoomResponseDto(
                entity.getId(),
                entity.getName(),
                entity.getClient().getId(),
                entity.getClient().getNickname(),
                entity.getFreelancer().getId(),
                entity.getFreelancer().getNickname()
        );
    }
}