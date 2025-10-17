package org.team4.project.domain.chat.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.team4.project.domain.member.entity.Member;
import org.team4.project.global.jpa.entity.BaseEntity;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private ChatRoom room;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    private String content;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private MessageType messageType;

    private Double amount;

    private String memo;

    private Long serviceId;

    public enum MessageType {
        TALK, PAYMENT_REQUEST, REVIEW_PROMPT, MEETING_REQUEST, WORK_COMPLETE_REQUEST, WORK_CONFIRMED
    }
}