package org.team4.project.domain.service.dto;

import lombok.Getter;
import org.team4.project.domain.member.entity.Member;
import org.team4.project.domain.service.entity.service.ProjectService;

public record ServiceDTO(
        Long id,
        FreelancerDTO freelancer,
        String title,
        String content,
        Integer price
) {
    public ServiceDTO(ProjectService service) {
        this(
            service.getId(),
            new FreelancerDTO(service.getFreelancer()),
            service.getTitle(),
            service.getContent(),
            service.getPrice()
        );
    }
    public static ServiceDTO from(ProjectService service) {
        return new ServiceDTO(service);
    }


    public void checkActorCanModify(Member actor) {
        if (!actor.getId().equals(freelancer.id())) {
            throw new IllegalArgumentException("%d번 글 수정 권한이 없습니다.".formatted(id()));
        }
    }

    public void checkActorCanDelete(Member actor) {
        if (!actor.getId().equals(freelancer.id())) {
            throw new IllegalArgumentException("%d번 글을 삭제할 권한이 없습니다.".formatted(id()));
        }
    }
}
