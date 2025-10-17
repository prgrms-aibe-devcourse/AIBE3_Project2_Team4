package org.team4.project.domain.profile.dto;

import lombok.Builder;
import lombok.Getter;
import org.team4.project.domain.profile.entity.FreelancerProfile;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
public class FreelancerProfileResponse {
    // 공통 필드
    private final String nickname;
    private final String introduction;
    private final double averageRating;
    private final String profileImageUrl;

    // 프리랜서 필드
    private final List<String> techStacks;
    private final List<String> certificates;
    private final List<CareerResponseDto> careers;
    private final List<PortfolioResponseDto> portfolios;

    public static FreelancerProfileResponse from(FreelancerProfile freelancerProfile) {
        return FreelancerProfileResponse.builder()
                .nickname(freelancerProfile.getNickname())
                .introduction(freelancerProfile.getIntroduction())
                .averageRating(freelancerProfile.getAverageRating())
                .techStacks(freelancerProfile.getTechStacks())
                .certificates(freelancerProfile.getCertificates())
                .careers(freelancerProfile.getCareers().stream()
                        .map(CareerResponseDto::from)
                        .collect(Collectors.toList()))
                .portfolios(freelancerProfile.getPortfolios().stream()
                        .map(PortfolioResponseDto::from)
                        .collect(Collectors.toList()))
                .profileImageUrl(freelancerProfile.getProfileImageUrl())
                .build();
    }
}
