package org.team4.project.domain.chat.dto;

import lombok.Data;

@Data
public class MessageRequest {
    private Long roomId;
    private String sender;
    private String content;
}