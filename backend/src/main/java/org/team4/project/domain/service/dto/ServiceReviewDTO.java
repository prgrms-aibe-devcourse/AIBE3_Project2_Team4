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
        List<String> images,
        String mainImage,
        String freelancerName,
        String freelancerEmail,
        String FreelancerProfileImage,
        String createdAt
) {
    public ServiceReviewDTO(ServiceReview review, List<String> imageUrls, String mainImageUrl) {
        this(
                review.getId(),
                review.getRating(),
                review.getContent(),
                imageUrls, // TODO: 실제 이미지 경로 배열로 대체
                mainImageUrl,
                review.getService().getFreelancer().getNickname(),
                review.getService().getFreelancer().getEmail(),
                review.getMember().getProfileImageUrl(),
                review.getCreatedAt().toString()
        );
    }
    public static ServiceReviewDTO from(ServiceReview review, List<String> imageUrls, String mainImageUrl) {
        return new ServiceReviewDTO(review, imageUrls, mainImageUrl);
    }
}
