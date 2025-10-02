package org.team4.project.domain.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.team4.project.domain.chat.entity.ChatMessage;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class MessageResponse {
    private Long id;
    private String sender;
    private String content;
    private LocalDateTime createdAt;

    public static MessageResponse from(ChatMessage entity) {
        return new MessageResponse(
                entity.getId(),
                entity.getSender(),
                entity.getContent(),
                entity.getCreatedAt()
        );
    }
}