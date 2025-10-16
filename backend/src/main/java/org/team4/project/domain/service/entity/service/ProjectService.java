package org.team4.project.domain.service.entity.service;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.team4.project.domain.member.entity.Member;
import org.team4.project.domain.service.dto.ServiceCreateRqBody;
import org.team4.project.domain.service.entity.category.TagService;
import org.team4.project.domain.service.entity.reviews.ServiceReview;
import org.team4.project.domain.service.exception.ServiceException;
import org.team4.project.global.jpa.entity.BaseEntity;

import java.util.List;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectService extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "freelancer_id")
    private Member freelancer;

    private String title;
    private String content;
    private Integer price;

    @OneToMany(mappedBy = "service")
    private List<TagService> tags;

    @OneToMany(mappedBy = "service", orphanRemoval = true, cascade = CascadeType.REMOVE)
    private List<ServiceReview> reviews;

    public static ProjectService addService(ServiceCreateRqBody serviceCreateRqBody, Member freelancer) {
        return ProjectService.builder()
                .freelancer(freelancer)
                .title(serviceCreateRqBody.title())
                .content(serviceCreateRqBody.content())
                .price(serviceCreateRqBody.price())
                .build();
    }

    public void modify(String newTitle, String newContent, Integer newPrice) {
        this.title = newTitle;
        this.content = newContent;
        this.price = newPrice;
    }

    public void checkActorCanModify(String actor) {
        if (!actor.equals(freelancer.getEmail())) {
            throw new ServiceException("%d번 글 수정 권한이 없습니다.".formatted(getId()));
        }
    }

    public void checkActorCanDelete(String actor) {
        if (!actor.equals(freelancer.getEmail())) {
            throw new ServiceException("%d번 글을 삭제할 권한이 없습니다.".formatted(getId()));
        }
    }
}
