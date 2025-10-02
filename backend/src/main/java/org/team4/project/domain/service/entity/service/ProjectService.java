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

    /**
     * Create a ProjectService populated from the given request body and associated with the given freelancer.
     *
     * @param serviceCreateRqBody request body containing the service title, content, and price
     * @param freelancer the member providing the service
     * @return a ProjectService populated with values from the request and linked to the freelancer
     */
    public static ProjectService addService(ServiceCreateRqBody serviceCreateRqBody, Member freelancer) {
        return ProjectService.builder()
                .freelancer(freelancer)
                .title(serviceCreateRqBody.title())
                .content(serviceCreateRqBody.content())
                .price(serviceCreateRqBody.price())
                .build();
    }

    /**
     * Updates this service's title, content, and price.
     *
     * @param newTitle   the title to set (may be null)
     * @param newContent the content/description to set (may be null)
     * @param newPrice   the price to set in integer units (may be null)
     */
    public void modify(String newTitle, String newContent, Integer newPrice) {
        this.title = newTitle;
        this.content = newContent;
        this.price = newPrice;
    }
}
