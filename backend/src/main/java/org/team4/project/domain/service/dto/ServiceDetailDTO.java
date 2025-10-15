package org.team4.project.domain.service.dto;

import org.team4.project.domain.service.entity.category.Category;
import org.team4.project.domain.service.entity.category.TagService;
import org.team4.project.domain.service.entity.category.type.CategoryType;
import org.team4.project.domain.service.entity.category.type.TagType;
import org.team4.project.domain.service.entity.service.ProjectService;

import java.util.List;

public record ServiceDetailDTO(
        Long id,
        String title,
        Integer price,
        Float rating,
        Integer reviewCount,
        List<String> images,
        String mainImage,
        String description,
        FreelancerDTO freelancer,
        CategoryType category,
        TagType[] tags
) {
    public ServiceDetailDTO(ProjectService service, List<TagService> tagServices, Category category, Integer reviewCount, Float rating, List<String> imageUrls, String mainImage) {
        this(
                service.getId(),
                service.getTitle(),
                service.getPrice(),
                rating,
                reviewCount,
                imageUrls,
                mainImage,
                service.getContent(),
                new FreelancerDTO(service.getFreelancer()),
                category.getName(), // CategoryType을 직접 반환하거나, 변환 로직 필요
                tagServices.stream()
                        .map(tagService -> tagService.getTag().getName())
                        .toArray(TagType[]::new)
        );
    }

    public static ServiceDetailDTO from(ProjectService service, List<TagService> tagServices, Category category, Integer reviewCount, Float rating, List<String> imageUrls, String mainImage) {
        return new ServiceDetailDTO(service, tagServices, category, reviewCount, rating, imageUrls, mainImage);
    }
}