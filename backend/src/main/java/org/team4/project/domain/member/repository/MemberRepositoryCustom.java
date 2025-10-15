package org.team4.project.domain.member.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.team4.project.domain.freelancer.dto.FreelancerRankingResponse;

public interface MemberRepositoryCustom {
    // 가중치 기반의 랭킹 점수에 따라 프리랜서(Member) 목록을 조회하고 페이징 처리.
    Page<FreelancerRankingResponse> findFreelancerRanking(Pageable pageable);
}
