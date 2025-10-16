package org.team4.project.domain.profile.dto;

import lombok.Builder;
import lombok.Getter;
import org.team4.project.domain.profile.entity.ClientProfile;
import org.team4.project.domain.profile.entity.FreelancerProfile;
import org.team4.project.domain.profile.entity.Profile;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
public class ProfileResponse {
    // 공통 필드
    private final String nickname;
    private final String introduction;
    private final double averageRating;
    private final String profileType; // "CLIENT" or "FREELANCER"
    private final Integer reviewCount; // 리뷰 수
    private final String profileImageUrl; // 프로필 이미지 URL

    // 클라이언트 필드
    private final String companyName;
    private final String teamName;

    // 프리랜서 필드
    private final List<String> techStacks;
    private final List<String> certificates;
    private final List<CareerResponseDto> careers;
    private final List<PortfolioResponseDto> portfolios;

    // Profile -> ProfileResponse
    public static ProfileResponse from(Profile profile, Integer reviewCount) {
        System.out.println("ProfileResponse 생성 - 프로필 이미지 URL: " + profile.getProfileImageUrl());
        
        ProfileResponseBuilder builder = ProfileResponse.builder()
                .nickname(profile.getNickname())
                .introduction(profile.getIntroduction())
                .profileImageUrl(profile.getProfileImageUrl())
                .averageRating(profile.getAverageRating())
                .reviewCount(reviewCount != null ? reviewCount : 0);

        if (profile instanceof ClientProfile) {
            ClientProfile client = (ClientProfile) profile;
            builder.profileType("CLIENT")
                    .companyName(client.getCompanyName())
                    .teamName(client.getTeamName());
        } else if (profile instanceof FreelancerProfile) {
            FreelancerProfile freelancer = (FreelancerProfile) profile;
            builder.profileType("FREELANCER")
                    .techStacks(freelancer.getTechStacks())
                    .certificates(freelancer.getCertificates())
                    .careers(freelancer.getCareers().stream()
                            .map(CareerResponseDto::from)
                            .collect(Collectors.toList()))
                    .portfolios(freelancer.getPortfolios().stream()
                            .map(PortfolioResponseDto::from)
                            .collect(Collectors.toList()));
        }
        return builder.build();
    }
}
