package org.team4.project.domain.activeService.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.team4.project.domain.member.entity.Member;
import org.team4.project.domain.payment.entity.Payment;
import org.team4.project.global.jpa.entity.BaseEntity;

@Entity
@NoArgsConstructor
@Getter
public class ActiveService extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    private Payment payment;

    @ManyToOne(fetch = FetchType.LAZY)
    private Member client;

    @ManyToOne(fetch = FetchType.LAZY)
    private Member freelancer;

    @Setter
    private boolean isFinished;

    public ActiveService(Payment payment) {
        this.payment = payment;
        this.client = payment.getMember();
        this.freelancer = payment.getProjectService().getFreelancer();
        this.isFinished = false;
    }
}
