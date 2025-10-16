package org.team4.project.domain.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.team4.project.domain.chat.entity.ChatMessage;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@Builder
public class MessageResponse {
    private Long id;
    private String sender;
    private String content;
    private LocalDateTime createdAt;
    private ChatMessage.MessageType messageType;
    private Double amount;
    private String memo;
    private Long serviceId;

    public static MessageResponse from(ChatMessage entity) {
        return MessageResponse.builder()
                .id(entity.getId())
                .sender(entity.getMember().getNickname())
                .content(entity.getContent())
                .createdAt(entity.getCreatedAt())
                .messageType(entity.getMessageType())
                .amount(entity.getAmount())
                .memo(entity.getMemo())
                .serviceId(entity.getServiceId())
                .build();
    }
}