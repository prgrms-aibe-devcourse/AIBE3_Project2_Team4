package org.team4.project.domain.profile.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class PortfolioRequestDto {
    private String title;
    private String description;
    private String link;
}
