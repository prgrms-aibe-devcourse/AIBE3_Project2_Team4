package org.team4.project.domain.profile.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.team4.project.domain.profile.dto.ClientProfileResponse;
import org.team4.project.domain.profile.dto.FreelancerProfileResponse;
import org.team4.project.domain.profile.dto.ProfileResponse;
import org.team4.project.domain.profile.dto.ProfileUpdateRequest;
import org.team4.project.domain.profile.entity.*;
import org.team4.project.domain.profile.repository.ProfileRepository;
import org.team4.project.domain.service.repository.ServiceReviewRepository;
import org.team4.project.domain.member.entity.Member;
import org.team4.project.domain.member.repository.MemberRepository;
import org.team4.project.domain.member.entity.MemberRole;

@Service
@RequiredArgsConstructor
@Transactional
public class ProfileService {
    private final ProfileRepository profileRepository;
    private final ServiceReviewRepository serviceReviewRepository;
    private final MemberRepository memberRepository;
    /**
     * 클라이언트 프로필 상세 조회
     */
    @Transactional(readOnly = true)
    public ClientProfileResponse findClientProfile(Long id) {
        Profile profile = profileRepository.findByMemberId(id)
                .orElseThrow(() -> new EntityNotFoundException("해당 회원의 프로필을 찾을 수 없습니다. id: " + id));

        if (!(profile instanceof ClientProfile)) {
            throw new EntityNotFoundException("해당 프로필은 클라이언트 프로필이 아닙니다. id: " + id);
        }
        return ClientProfileResponse.from((ClientProfile) profile);
    }

    /**
     * 프리랜서 프로필 상세 조회
     */
    @Transactional(readOnly = true)
    public FreelancerProfileResponse findFreelancerProfile(Long id) {
        Profile profile = profileRepository.findByMemberId(id)
                .orElseThrow(() -> new EntityNotFoundException("해당 회원의 프로필을 찾을 수 없습니다. id: " + id));

        if (!(profile instanceof FreelancerProfile)) {
            throw new EntityNotFoundException("해당 프로필은 프리랜서 프로필이 아닙니다. id: " + id);
        }
        return FreelancerProfileResponse.from((FreelancerProfile) profile);
    }

    /**
     * 프로필 조회
     */
    public ProfileResponse findProfileByMemberId(Long memberId) {
        Profile profile = profileRepository.findByMemberId(memberId)
                .orElse(null);

        // 프로필이 없으면 기본 프로필 생성
        if (profile == null) {
            profile = createDefaultProfile(memberId);
        }

        // 프리랜서인 경우 리뷰 수 조회
        Integer reviewCount = null;
        if (profile instanceof FreelancerProfile) {
            reviewCount = serviceReviewRepository.countByFreelancerId(memberId);
        }

        return ProfileResponse.from(profile, reviewCount);
    }

    /**
     * 내 프로필 수정
     */
    public void updateMyProfile(Long memberId, ProfileUpdateRequest request) {
        Profile profile = profileRepository.findByMemberId(memberId)
                .orElseThrow(() -> new EntityNotFoundException("내 프로필 정보를 찾을 수 없습니다."));

        System.out.println("프로필 업데이트 요청 - memberId: " + memberId);
        System.out.println("프로필 이미지 URL: " + request.getProfileImageUrl());
        
        profile.updateProfile(request.getNickname(), request.getIntroduction(), request.getProfileImageUrl());

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

    /**
     * 기본 프로필 생성
     */
    @Transactional
    private Profile createDefaultProfile(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new EntityNotFoundException("회원을 찾을 수 없습니다: " + memberId));

        Profile profile;
        
        if (member.getMemberRole() == MemberRole.CLIENT) {
            ClientProfile clientProfile = new ClientProfile();
            clientProfile.setMember(member);
            clientProfile.setNickname(member.getNickname());
            clientProfile.setProfileImageUrl(member.getProfileImageUrl());
            profile = clientProfile;
        } else if (member.getMemberRole() == MemberRole.FREELANCER) {
            FreelancerProfile freelancerProfile = new FreelancerProfile();
            freelancerProfile.setMember(member);
            freelancerProfile.setNickname(member.getNickname());
            freelancerProfile.setProfileImageUrl(member.getProfileImageUrl());
            profile = freelancerProfile;
        } else {
            // UNASSIGNED인 경우 기본적으로 CLIENT로 생성
            ClientProfile clientProfile = new ClientProfile();
            clientProfile.setMember(member);
            clientProfile.setNickname(member.getNickname());
            clientProfile.setProfileImageUrl(member.getProfileImageUrl());
            profile = clientProfile;
        }

        return profileRepository.save(profile);
    }
}
