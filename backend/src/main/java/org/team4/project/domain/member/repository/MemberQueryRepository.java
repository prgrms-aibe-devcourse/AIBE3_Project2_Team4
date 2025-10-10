package org.team4.project.domain.member.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.team4.project.domain.member.dto.PaymentHistoryResponseDTO;

import java.util.List;

import static org.team4.project.domain.member.entity.QMember.member;
import static org.team4.project.domain.payment.entity.QPayment.payment;
import static org.team4.project.domain.service.entity.service.QProjectService.projectService;

@Repository
@RequiredArgsConstructor
public class MemberQueryRepository {

    private final JPAQueryFactory queryFactory;

    public List<PaymentHistoryResponseDTO> getPaymentHistories(String email) {
        return queryFactory.select(Projections.constructor(
                                   PaymentHistoryResponseDTO.class,
                                   projectService.freelancer.id,
                                   projectService.id,
                                   projectService.title,
                                   payment.totalAmount,
                                   payment.approvedAt,
                                   payment.paymentStatus
                           ))
                           .from(payment)
                           //TODO : leftJoin -> join 변경
                           .leftJoin(payment.member, member)
                           .leftJoin(payment.projectService, projectService)
                           .where(member.email.eq(email))
                           .fetch();
    }
}
