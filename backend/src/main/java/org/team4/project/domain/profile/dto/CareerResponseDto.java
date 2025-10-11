package org.team4.project.domain.profile.dto;

import lombok.Builder;
import lombok.Getter;
import org.team4.project.domain.profile.entity.Career;

@Getter
@Builder
public class CareerResponseDto {
    private final String position;
    private final String companyName;
    private final String term;
    private final String description;

    // Career -> CareerResponseDto
    public static CareerResponseDto from(Career career) {
        return CareerResponseDto.builder()
                .position(career.getPosition())
                .companyName(career.getCompanyName())
                .term(career.getTerm())
                .description(career.getDescription())
                .build();

    }
}