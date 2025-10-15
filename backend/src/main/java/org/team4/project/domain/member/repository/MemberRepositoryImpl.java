package org.team4.project.domain.member.repository;

import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.team4.project.domain.freelancer.dto.FreelancerRankingResponse;
import org.team4.project.domain.freelancer.dto.QFreelancerRankingResponse;
import org.team4.project.domain.member.entity.MemberRole;

import java.time.LocalDateTime;
import java.util.List;

import static org.team4.project.domain.service.entity.reviews.QServiceReview.serviceReview;

/**
 * MemberRepositoryCustom 인터페이스의 Querydsl 구현체.
 * 프리랜서 랭킹 계산을 위한 복잡한 쿼리를 담당합니다.
 */
@RequiredArgsConstructor
public class MemberRepositoryImpl implements MemberRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public Page<FreelancerRankingResponse> findFreelancerRanking(Pageable pageable) {

        // '품질 점수'를 위한 [평균 별점] 계산
        // 각 프리랜서의 모든 리뷰에 대한 별점(rating)의 평균을 계산하는 표현식입니다.
        NumberExpression<Double> averageRating = serviceReview.rating.avg();

        // '신뢰도/경험 점수'를 위한 [총 리뷰 수] 계산
        // 각 프리랜서가 받은 총 리뷰의 개수를 계산하는 표현식입니다.
        NumberExpression<Long> reviewCount = serviceReview.id.count();

        // '최신 활동 점수'를 위한 [최근 리뷰 수] 계산
        // CaseBuilder를 사용하여 조건부 합계를 계산합니다.
        // 각 리뷰의 생성일(createdAt)이 최근 90일 이내이면 1을, 아니면 0을 더하여
        // 최근 활동의 척도로 삼습니다.
        NumberExpression<Integer> recentReviewCount = new CaseBuilder()
                .when(serviceReview.createdAt.after(LocalDateTime.now().minusDays(90)))
                .then(1) // 90일 이내면 1
                .otherwise(0) // 아니면 0
                .sum(); // 이 값들을 모두 더함

        // 최종 [랭킹 점수] 계산식
        // 조합하여 최종 랭킹 점수를 계산하는 표현식(Expression)을 만듭니다.
        NumberExpression<Double> rankingScore =
                // (A × 품질 점수): 평균 별점에 가중치 50% 적용
                averageRating.multiply(0.5)
                        .add(
                                // (B × 신뢰도/경험 점수): 리뷰 수에 로그를 씌워 가중치 30% 적용
                                // log(0)은 에러이므로, reviewCount에 1을 더해줍니다.
                                Expressions.numberTemplate(Double.class, "log10({0})", reviewCount.add(1)).multiply(0.3)
                        )
                        .add(
                                // (C × 최신 활동 점수): 최근 리뷰 수에 가중치 20% 적용
                                recentReviewCount.multiply(0.2)
                        )
                        // coalesce(0.0): 만약 어떤 프리랜서가 리뷰를 하나도 받지 않아
                        // 위 계산 결과가 NULL이 되면, 그 점수를 0점으로 처리합니다.
                        .coalesce(0.0);

        // 1. 데이터 조회 쿼리
        List<FreelancerRankingResponse> content = queryFactory
                // SELECT 절: 조회 결과를 QFreelancerRankingResponse DTO로 바로 매핑합니다.
                .select(new QFreelancerRankingResponse(
                        serviceReview.freelancer.nickname, // Member 엔티티의 nickname 필드 사용
                        averageRating,
                        reviewCount
                ))
                // FROM 절: 쿼리의 기준 테이블은 service_review 입니다.
                .from(serviceReview)
                // WHERE 절: 랭킹 대상은 MemberRole이 FREELANCER인 사용자만 포함합니다.
                .where(serviceReview.freelancer.memberRole.eq(MemberRole.FREELANCER))
                // GROUP BY 절: 프리랜서(member) 단위로 그룹화하여 평균, 개수 등 통계를 계산합니다.
                .groupBy(serviceReview.freelancer)
                // ORDER BY 절: 위에서 만든 'rankingScore'를 기준으로 내림차순 정렬합니다.
                .orderBy(rankingScore.desc(), serviceReview.freelancer.id.asc())
                // PAGING
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        // 2. 전체 프리랜서(리뷰가 있는) 수 조회 쿼리
        Long total = queryFactory
                .select(serviceReview.freelancer.countDistinct())
                .from(serviceReview)
                .where(serviceReview.freelancer.memberRole.eq(MemberRole.FREELANCER))
                .fetchOne();

        return new PageImpl<>(content, pageable, total != null ? total : 0);
    }
}