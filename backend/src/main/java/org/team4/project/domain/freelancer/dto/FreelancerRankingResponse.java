package org.team4.project.domain.freelancer.dto;

import com.querydsl.core.annotations.QueryProjection;
import lombok.Getter;
import lombok.Setter;

@Getter
public class FreelancerRankingResponse {

    // Service 레이어에서 최종 순위를 계산하여 설정하기 위해 @Setter를 추가
    @Setter
    private long rank;

    private final String nickname;
    private final double averageRating;
    private final long reviewCount;

    /**
     * Querydsl의 Projections.constructor를 사용하여 조회 결과를 DTO로 직접 매핑하기 위한 생성자.
     * @QueryProjection 어노테이션을 붙이면, 컴파일 시점에 이 생성자를 사용하는 Q-Type 클래스(QFreelancerRankingResponse)가
     * 생성되어 타입 안정성을 높임.
     */
    @QueryProjection
    public FreelancerRankingResponse(String nickname, double averageRating, long reviewCount) {
        this.nickname = nickname;
        // 소수점 두 자리까지만 표시되도록 반올림하여 저장.
        this.averageRating = Math.round(averageRating * 100) / 100.0;
        this.reviewCount = reviewCount;
    }
}
