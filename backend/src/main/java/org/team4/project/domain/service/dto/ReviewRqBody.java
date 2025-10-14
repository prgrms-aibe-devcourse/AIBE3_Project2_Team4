package org.team4.project.domain.service.dto;

import jakarta.validation.constraints.*;
import org.team4.project.domain.service.entity.category.type.TagType;

import java.util.List;

public record ReviewRqBody(
        @NotBlank
        @Size(min = 1, max = 1000)
        String content,
        @NotNull
        @DecimalMin("0.0")
        @DecimalMax("5.0")
        Float rating
) {
}
