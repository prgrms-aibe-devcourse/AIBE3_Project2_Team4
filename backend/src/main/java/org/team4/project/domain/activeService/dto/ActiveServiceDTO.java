package org.team4.project.domain.activeService.dto;

import org.hibernate.usertype.UserType;
import org.team4.project.domain.activeService.entity.ActiveService;
import org.team4.project.domain.member.entity.MemberRole;
import org.team4.project.domain.payment.entity.Payment;
import org.team4.project.domain.service.entity.reviews.ServiceReview;
import org.team4.project.domain.service.entity.service.ProjectService;

public record ActiveServiceDTO(
        Long id,
        String ServiceTitle,
        Float rating,
        int rateCount,
        String partnerName,
        int price,
        String memo,
        boolean isFinished
) {
    public ActiveServiceDTO(Long id, Payment payment, ProjectService sc, float avgRate, int rateCount, String partnerName, boolean isFinished) {
        this(
                id,
                sc.getTitle(),
                avgRate,
                rateCount,
                partnerName,
                payment.getTotalAmount(),
                payment.getMemo(),
                isFinished
        );
    }

    public static ActiveServiceDTO from(ActiveService at, MemberRole memberRole) {
        Payment payment = at.getPayment();
        ProjectService service = payment.getProjectService();
        double avgRating = service.getReviews().stream()
                .mapToDouble(ServiceReview::getRating)
                .average()
                .orElse(0.0);
        int rateCount = service.getReviews().size();

        String partnerName = null;
        if (memberRole.equals(MemberRole.CLIENT)) partnerName = at.getFreelancer().getNickname();
        else partnerName = at.getClient().getNickname();

        boolean isFinished = at.isFinished();
        return new ActiveServiceDTO(at.getId(), payment, service, (float) avgRating, rateCount, partnerName, isFinished);
    }
}
