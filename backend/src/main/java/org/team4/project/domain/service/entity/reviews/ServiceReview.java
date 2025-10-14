package org.team4.project.domain.service.entity.reviews;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.team4.project.domain.member.entity.Member;
import org.team4.project.domain.service.dto.ReviewRqBody;
import org.team4.project.domain.service.entity.service.ProjectService;
import org.team4.project.global.jpa.entity.BaseEntity;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceReview extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "freelancer_id")
    private Member freelancer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id")
    private ProjectService service;

    private String content;
    private Float rating;

    public static ServiceReview createReview(Member freelancer, Member member, ProjectService service, ReviewRqBody reviewRqBody) {
        return ServiceReview.builder()
            .freelancer(freelancer)
            .member(member)
            .service(service)
            .content(reviewRqBody.content())
            .rating(reviewRqBody.rating())
            .build();
    }
}
