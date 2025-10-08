package org.team4.project.domain.profile.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.team4.project.domain.profile.dto.ProfileResponse;
import org.team4.project.domain.profile.dto.ProfileUpdateRequest;
import org.team4.project.domain.profile.entity.*;
import org.team4.project.domain.profile.repository.ProfileRepository;

@Service
@RequiredArgsConstructor
@Transactional
public class ProfileService {
    private final ProfileRepository profileRepository;

    /**
     * 프로필 조회
     */
    @Transactional(readOnly = true)
    public ProfileResponse findProfileByMemberId(Long memberId) {
        Profile profile = profileRepository.findByMemberId(memberId)
                .orElseThrow(() -> new EntityNotFoundException("해당 회원의 프로필을 찾을 수 없습니다. memberId: " + memberId));

        return ProfileResponse.from(profile);
    }

    /**
     * 내 프로필 수정
     */
    public void updateMyProfile(Long memberId, ProfileUpdateRequest request) {
        Profile profile = profileRepository.findByMemberId(memberId)
                .orElseThrow(() -> new EntityNotFoundException("내 프로필 정보를 찾을 수 없습니다."));

        profile.updateProfile(request.getNickname(), request.getIntroduction());

        if (profile instanceof ClientProfile) {
            updateClientProfile((ClientProfile) profile, request);
        } else if (profile instanceof FreelancerProfile) {
            updateFreelancerProfile((FreelancerProfile) profile, request);
        }
    }

    private void updateClientProfile(ClientProfile client, ProfileUpdateRequest request) {
        client.setCompanyName(request.getCompanyName());
        client.setTeamName(request.getTeamName());
    }

    private void updateFreelancerProfile(FreelancerProfile freelancer, ProfileUpdateRequest request) {
        // ElementCollection 업데이트 (clear & addAll)
        freelancer.getTechStacks().clear();
        freelancer.getTechStacks().addAll(request.getTechStacks());

        freelancer.getCertificates().clear();
        freelancer.getCertificates().addAll(request.getCertificates());

        // OneToMany 업데이트 (clear & addAll)
        freelancer.getCareers().clear();
        request.getCareers().forEach(dto -> {
            freelancer.addCareer(Career.from(dto, freelancer));
        });

        freelancer.getPortfolios().clear();
        request.getPortfolios().forEach(dto -> {
            freelancer.addPortfolio(Portfolio.from(dto, freelancer));
        });
    }
}
