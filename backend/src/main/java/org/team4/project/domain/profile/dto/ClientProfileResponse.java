package org.team4.project.domain.profile.dto;

import lombok.Builder;
import lombok.Getter;
import org.team4.project.domain.profile.entity.ClientProfile;

@Getter
@Builder
public class ClientProfileResponse {
    // 공통 필드
    private final String nickname;
    private final String introduction;
    private final double averageRating;
    private final String profileImageUrl;

    // 클라이언트 필드
    private final String companyName;
    private final String teamName;

    public static ClientProfileResponse from(ClientProfile clientProfile) {
        return ClientProfileResponse.builder()
                .nickname(clientProfile.getNickname())
                .introduction(clientProfile.getIntroduction())
                .averageRating(clientProfile.getAverageRating())
                .companyName(clientProfile.getCompanyName())
                .teamName(clientProfile.getTeamName())
                .profileImageUrl(clientProfile.getProfileImageUrl())
                .build();
    }
}
