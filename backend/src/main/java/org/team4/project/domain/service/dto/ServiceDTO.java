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
}
