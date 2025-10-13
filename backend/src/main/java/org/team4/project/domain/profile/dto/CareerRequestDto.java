package org.team4.project.domain.profile.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CareerRequestDto {
    private String position;
    private String companyName;
    private String term;
    private String description;
}
