package org.team4.project.domain.service.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.team4.project.domain.member.entity.Member;
import org.team4.project.domain.service.dto.ReviewRqBody;
import org.team4.project.domain.service.dto.ServiceReviewDTO;
import org.team4.project.domain.service.service.ReviewService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/review")
public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping("/{serviceId}")
    @Transactional
    public void createServiceReview(
            @PathVariable Long serviceId,
            @Valid @RequestBody ReviewRqBody reviewRqBody) {
        Member member = new Member(); // = 인증된 사용자 정보로 대체 필요
        reviewService.createReview(serviceId, member, reviewRqBody);
    }

    @GetMapping("/{serviceId}")
    @Transactional(readOnly = true)
    public Page<ServiceReviewDTO> getServiceReviews(
            @PageableDefault(page = 0, size = 5, sort="id", direction = Sort.Direction.DESC) Pageable pageable,
            @PathVariable Long serviceId) {
        return reviewService.getReviewsWithServiceId(pageable, serviceId);
    }
}
