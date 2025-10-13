package org.team4.project.domain.service.dto;


import org.team4.project.domain.member.entity.Member;

public record FreelancerDTO(
        Long id,
        String nickname,
        String email
        //Todo: 프로필 사진, Rating 필요
) {
    public FreelancerDTO(Member member) {
        this(
                member.getId(),
                member.getNickname(),
                member.getEmail()
        );
    }
}
