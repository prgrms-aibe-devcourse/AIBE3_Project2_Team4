package org.team4.project.domain.service.entity.bookmark;

import jakarta.persistence.*;
import lombok.*;
import org.team4.project.domain.member.entity.Member;
import org.team4.project.domain.service.entity.service.ProjectService;
import org.team4.project.global.jpa.entity.BaseEntity;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookMark extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id")
    private ProjectService service;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    public static BookMark createBookMark(ProjectService service, Member member) {
        return BookMark.builder()
            .service(service)
            .member(member)
            .build();
    }
}
