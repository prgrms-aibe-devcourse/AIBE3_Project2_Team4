package org.team4.project.domain.freelancer.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.team4.project.domain.freelancer.dto.FreelancerRankingResponse;
import org.team4.project.domain.freelancer.service.FreelancerRankingService;

@RestController
@RequestMapping("/api/v1/freelancers")
@RequiredArgsConstructor
public class FreelancerRankingController {

    private final FreelancerRankingService freelancerRankingService;

    /**
     * 프리랜서 랭킹 조회
     * @param pageable Spring이 URL 쿼리 파라미터(?page=&size=)를 분석하여 자동으로 생성해주는 페이징 객체
     * @return 페이징 처리된 프리랜서 랭킹 목록
     */
    @GetMapping("/ranking")
    public ResponseEntity<Page<FreelancerRankingResponse>> getFreelancerRanking(
            @PageableDefault(size = 100) Pageable pageable) {
        Page<FreelancerRankingResponse> ranking = freelancerRankingService.getFreelancerRanking(pageable);
        return ResponseEntity.ok(ranking);
    }
}