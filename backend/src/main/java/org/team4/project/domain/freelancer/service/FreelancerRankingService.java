package org.team4.project.domain.freelancer.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.team4.project.domain.freelancer.dto.FreelancerRankingResponse;
import org.team4.project.domain.member.repository.MemberRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FreelancerRankingService {

    private final MemberRepository memberRepository;

    /**
     * 프리랜서 랭킹 목록을 조회하고, 각 항목에 순위를 부여.
     * @param pageable 페이징 정보
     * @return 순위가 매겨진 프리랜서 랭킹 페이지
     */
    public Page<FreelancerRankingResponse> getFreelancerRanking(Pageable pageable) {
        // MemberRepository의 커스텀 메서드를 호출하여 정렬된 랭킹 데이터를 조회
        Page<FreelancerRankingResponse> rankingPage = memberRepository.findFreelancerRanking(pageable);

        // 조회된 데이터 목록을 순회하며 각 DTO에 실제 순위(rank)를 설정
        long offset = pageable.getOffset(); // 현재 페이지의 시작 순번 (예: 0, 20, 40...)
        List<FreelancerRankingResponse> content = rankingPage.getContent();
        for (int i = 0; i < content.size(); i++) {
            content.get(i).setRank(offset + i + 1); // 시작 순번 + 현재 인덱스 + 1
        }

        return rankingPage;
    }
}