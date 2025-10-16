package org.team4.project.domain.activeService.dto;

import org.team4.project.domain.activeService.entity.ActiveService;
import org.team4.project.domain.member.entity.MemberRole;
import org.team4.project.domain.payment.entity.Payment;
import org.team4.project.domain.service.entity.reviews.ServiceReview;
import org.team4.project.domain.service.entity.service.ProjectService;

public record ActiveServiceDTO(
        Long id,
        String thumbnail,
        String title,
        int price,
        Float rating,
        int reviewCount,
        String partnerName,
        boolean isFinished,
        String memo,
        Long chatId

) {
    public ActiveServiceDTO(Long id, Payment payment, ProjectService sc, float avgRate, int rateCount, String partnerName, boolean isFinished, Long chatId, String mainImage) {
        this(
            id,
            mainImage,
            sc.getTitle(),
            payment.getTotalAmount(),
            avgRate,
            rateCount,
            partnerName,
            isFinished,
            payment.getMemo(),
            chatId
        );
    }

    public static ActiveServiceDTO from(ActiveService at, Payment payment, ProjectService projectService, MemberRole memberRole, Long chatId, String mainImage) {
        double avgRating = projectService.getReviews().stream()
                .mapToDouble(ServiceReview::getRating)
                .average()
                .orElse(0.0);
        int rateCount = projectService.getReviews().size();

        String partnerName = null;
        if (memberRole.equals(org.team4.project.domain.member.entity.MemberRole.CLIENT)) partnerName = at.getFreelancer().getNickname();
        else partnerName = at.getClient().getNickname();

        boolean isFinished = at.isFinished();
        return new ActiveServiceDTO(at.getId(), payment, projectService, (float) avgRating, rateCount, partnerName, isFinished, chatId, mainImage);
    }
}
