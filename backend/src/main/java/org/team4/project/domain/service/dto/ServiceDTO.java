package org.team4.project.domain.service.dto;

import org.team4.project.domain.service.entity.category.Category;
import org.team4.project.domain.service.entity.category.TagService;
import org.team4.project.domain.service.entity.category.type.CategoryType;
import org.team4.project.domain.service.entity.category.type.TagType;
import org.team4.project.domain.service.entity.service.ProjectService;

import java.util.List;

public record ServiceDTO(
        Long id,
        String thumbnail,
        String title,
        Integer price,
        Float rating,
        Integer reviewCount,
        String freelancerName,
        CategoryType category,
        TagType[] tags,
        String content,
        String createdAt
) {
    public ServiceDTO(ProjectService service, List<TagService> tagServices, Category category, Integer reviewCount, Float rating, String mainImage) {
        this(
                service.getId(),
                mainImage,
                service.getTitle(),
                service.getPrice(),
                rating, // rating
                reviewCount, // reviewCount
                service.getFreelancer().getNickname(),
                category.getName(),
                tagServices.stream()
                        .map(tagService -> tagService.getTag().getName())
                        .toArray(TagType[]::new),
                service.getContent(),
                service.getCreatedAt().toString()
        );
    }
    public static ServiceDTO from(ProjectService service, List<TagService> tagServices, Category category, Integer reviewCount, Float rating, String mainImage) {
        return new ServiceDTO(service, tagServices, category, reviewCount, rating, mainImage);
    }

    public ServiceDTO(ProjectService service, Integer reviewCount, Float rating, String mainImage) {
        this(
                service.getId(),
                mainImage,
                service.getTitle(),
                service.getPrice(),
                rating, // rating
                reviewCount, // reviewCount
                service.getFreelancer().getNickname(),
                null,
                null,
                service.getContent(),
                service.getCreatedAt().toString()
        );
    }

    public static ServiceDTO fromCardOnly(ProjectService service, Integer reviewCount, Float rating, String mainImage) {
        return new ServiceDTO(service, reviewCount, rating, mainImage);
    }
}
