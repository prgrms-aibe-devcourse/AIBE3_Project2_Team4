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
        String[] images,
        String description,
        FreelancerDTO freelancer,
        CategoryType category,
        TagType[] tags
) {
    public ServiceDetailDTO(ProjectService service, List<TagService> tagServices, Category category, Integer reviewCount, Float rating) {
        this(
                service.getId(),
                service.getTitle(),
                service.getPrice(),
                rating,
                reviewCount,
                new String[]{"", "", ""}, // TODO: 실제 이미지 경로 배열로 대체
                service.getContent(),
                new FreelancerDTO(service.getFreelancer()),
                category.getName(), // CategoryType을 직접 반환하거나, 변환 로직 필요
                tagServices.stream()
                        .map(tagService -> tagService.getTag().getName())
                        .toArray(TagType[]::new)
        );
    }

    public static ServiceDetailDTO from(ProjectService service, List<TagService> tagServices, Category category, Integer reviewCount, Float rating) {
        return new ServiceDetailDTO(service, tagServices, category, reviewCount, rating);
    }
}