package org.team4.project.domain.chat.dto;

import lombok.Data;
import org.team4.project.domain.chat.entity.ChatMessage;

@Data
public class MessageRequest {
    private Long roomId;
    private String content;
    private ChatMessage.MessageType messageType;
    private Double amount;
    private String memo;
    private Long serviceId;
}