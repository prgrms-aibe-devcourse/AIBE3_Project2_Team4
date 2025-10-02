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
    /**
     * Creates a ServiceDTO by extracting identifying and display fields from the given ProjectService.
     *
     * @param service the ProjectService to convert into a ServiceDTO
     */
    public ServiceDTO(ProjectService service) {
        this(
            service.getId(),
            new FreelancerDTO(service.getFreelancer()),
            service.getTitle(),
            service.getContent(),
            service.getPrice()
        );
    }
    /**
     * Create a ServiceDTO from a ProjectService.
     *
     * @param service the ProjectService to convert
     * @return a ServiceDTO representing the provided ProjectService
     */
    public static ServiceDTO from(ProjectService service) {
        return new ServiceDTO(service);
    }


    /**
     * Verifies that the given actor is authorized to modify this service.
     *
     * @param actor the member attempting the modification
     * @throws IllegalArgumentException if the actor's id does not match the freelancer's id; the exception message indicates lack of permission for this service id
     */
    public void checkActorCanModify(Member actor) {
        if (!actor.getId().equals(freelancer.id())) {
            throw new IllegalArgumentException("%d번 글 수정 권한이 없습니다.".formatted(id()));
        }
    }

    /**
     * Ensures the given member is authorized to delete this service.
     *
     * @param actor the member attempting to delete the service
     * @throws IllegalArgumentException if the actor's id does not match the freelancer's id for this service
     */
    public void checkActorCanDelete(Member actor) {
        if (!actor.getId().equals(freelancer.id())) {
            throw new IllegalArgumentException("%d번 글을 삭제할 권한이 없습니다.".formatted(id()));
        }
    }
}
