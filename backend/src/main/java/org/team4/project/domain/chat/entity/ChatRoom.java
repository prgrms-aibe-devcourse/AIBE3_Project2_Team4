package org.team4.project.domain.chat.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.team4.project.domain.member.entity.Member;
import org.team4.project.global.jpa.entity.BaseEntity;

@Data
@Entity
public class ChatRoom extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id")
    private Member client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "freelancer_id")
    private Member freelancer;
}
