package org.team4.project.domain.service.entity.service;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.team4.project.domain.member.entity.Member;
import org.team4.project.domain.service.dto.ServiceCreateRqBody;
import org.team4.project.global.jpa.entity.BaseEntity;

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

    public void checkActorCanModify(Member actor) {
        if (!actor.getId().equals(freelancer.getId())) {
            throw new IllegalArgumentException("%d번 글 수정 권한이 없습니다.".formatted(getId()));
        }
    }

    public void checkActorCanDelete(Member actor) {
        if (!actor.getId().equals(freelancer.getId())) {
            throw new IllegalArgumentException("%d번 글을 삭제할 권한이 없습니다.".formatted(getId()));
        }
    }
}
