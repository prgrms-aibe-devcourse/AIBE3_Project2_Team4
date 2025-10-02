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

    public ProjectService(Long id, String title, String content, Integer price) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.price = price;
    }

    public void modify(String newTitle, String newContent, Integer newPrice) {
        this.title = newTitle;
        this.content = newContent;
        this.price = newPrice;
    }
}
