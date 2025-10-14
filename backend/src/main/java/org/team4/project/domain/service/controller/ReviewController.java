package org.team4.project.domain.service.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.team4.project.domain.member.entity.Member;
import org.team4.project.domain.service.dto.ReviewRqBody;
import org.team4.project.domain.service.dto.ServiceReviewDTO;
import org.team4.project.domain.service.service.ReviewService;
import org.team4.project.global.security.CustomUserDetails;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/reviews")
public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping("/{serviceId}")
    @Transactional
    public void createServiceReview(
            @PathVariable Long serviceId,
            @AuthenticationPrincipal CustomUserDetails customUserDetails,
            @Valid @RequestBody ReviewRqBody reviewRqBody) {
        reviewService.createReview(serviceId, customUserDetails.getEmail(), reviewRqBody);
    }

    @GetMapping("/{serviceId}")
    @Transactional(readOnly = true)
    public Page<ServiceReviewDTO> getServiceReviews(
            @PageableDefault(page = 0, size = 5, sort="id", direction = Sort.Direction.DESC) Pageable pageable,
            @PathVariable Long serviceId) {
        return reviewService.getReviewsWithServiceId(pageable, serviceId);
    }
}
