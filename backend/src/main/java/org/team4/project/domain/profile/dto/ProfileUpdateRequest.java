package org.team4.project.domain.profile.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class ProfileUpdateRequest {
    // 공통
    private String nickname;
    private String introduction;

    // 클라이언트
    private String companyName;
    private String teamName;

    // 프리랜서
    private List<String> techStacks;
    private List<String> certificates;
    private List<CareerRequestDto> careers;
    private List<PortfolioRequestDto> portfolios;
}
