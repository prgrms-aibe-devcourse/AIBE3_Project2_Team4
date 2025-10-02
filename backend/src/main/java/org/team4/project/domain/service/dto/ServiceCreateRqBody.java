package org.team4.project.domain.service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ServiceCreateRqBody(
        @NotBlank
        @Size(min = 2, max = 100)
        String title,
        @NotBlank
        @Size(min = 2, max = 1000)
        String content,
        @NotBlank
        @Size(min = 2, max = 100)
        Integer price
) {
}
