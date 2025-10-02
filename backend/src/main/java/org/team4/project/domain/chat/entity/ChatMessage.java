package org.team4.project.domain.chat.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.team4.project.global.jpa.entity.BaseEntity;

import java.time.LocalDateTime;

@Data
@Entity
public class ChatMessage extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private ChatRoom room;

    private String sender; // 나중에 Member 엔티티 연동
    private String content;
}