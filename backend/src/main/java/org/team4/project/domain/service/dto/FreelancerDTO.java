package org.team4.project.domain.service.dto;


import org.team4.project.domain.member.entity.Member;

public record FreelancerDTO(
        Long id,
        String nickname,
        String email
) {
    public FreelancerDTO(Member member) {
        this(
                member.getId(),
                member.getNickname(),
                member.getEmail()
        );
    }
}
