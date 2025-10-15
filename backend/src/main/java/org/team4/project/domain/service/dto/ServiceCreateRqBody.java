package org.team4.project.domain.service.dto;

import jakarta.validation.constraints.*;
import org.team4.project.domain.service.entity.category.type.TagType;

import java.util.List;

public record ServiceCreateRqBody(
        @NotBlank
        @Size(min = 2, max = 100)
        String title,
        @NotBlank
        @Size(min = 2, max = 1000)
        String content,
        @NotNull
        @Min(0)
        @Max(1000000000)
        Integer price,
        @NotNull
        List<TagType> tagNames,
        @NotNull
        List<String> imageUrls,
        @NotNull
        String mainImageUrl
) {
}
