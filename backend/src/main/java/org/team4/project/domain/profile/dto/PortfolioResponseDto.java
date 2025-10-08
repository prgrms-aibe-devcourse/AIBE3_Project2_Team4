package org.team4.project.domain.profile.dto;

import lombok.Builder;
import lombok.Getter;
import org.team4.project.domain.profile.entity.Portfolio;

@Getter
@Builder
public class PortfolioResponseDto {
    private final String title;
    private final String description;
    private final String link;

    // Portfolio -> PortfolioResponseDto
    public static PortfolioResponseDto from(Portfolio portfolio) {
        return PortfolioResponseDto.builder()
                .title(portfolio.getTitle())
                .description(portfolio.getDescription())
                .link(portfolio.getLink())
                .build();
    }
}
