package org.team4.project.domain.service.dto;

import org.team4.project.domain.service.entity.category.Category;
import org.team4.project.domain.service.entity.category.TagService;
import org.team4.project.domain.service.entity.category.type.TagType;
import org.team4.project.domain.service.entity.reviews.ServiceReview;
import org.team4.project.domain.service.entity.service.ProjectService;

import java.util.List;

public record ServiceReviewDTO(
        Long id,
        Float rating,
        String content,
        String[] images,
        String freelancerName,
        String freelancerEmail,
        String FreelancerProfileImage,
        String createdAt
) {
    public ServiceReviewDTO(ServiceReview review) {
        this(
                review.getId(),
                review.getRating(),
                review.getContent(),
                new String[]{"", "", ""}, // TODO: 실제 이미지 경로 배열로 대체
                review.getService().getFreelancer().getNickname(),
                review.getService().getFreelancer().getEmail(),
                "/profile.jpg", // TODO: 실제 프로필 이미지 경로로 대체
                review.getCreatedAt().toString()
        );
    }
    public static ServiceReviewDTO from(ServiceReview review) {
        return new ServiceReviewDTO(review);
    }
}
