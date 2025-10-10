package org.team4.project.domain.service.dto;

import lombok.Getter;
import org.team4.project.domain.member.entity.Member;
import org.team4.project.domain.service.entity.category.Category;
import org.team4.project.domain.service.entity.category.Tag;
import org.team4.project.domain.service.entity.category.TagService;
import org.team4.project.domain.service.entity.category.type.CategoryType;
import org.team4.project.domain.service.entity.category.type.TagType;
import org.team4.project.domain.service.entity.service.ProjectService;

import java.util.List;
import java.util.stream.Collectors;

public record ServiceDTO(
        Long id,
        String thumbnail,
        String title,
        Integer price,
        Integer rating,
        Integer reviewCount,
        String freelancerName,
        CategoryType category,
        TagType[] tags,
        String content,
        String createdAt
) {
    public ServiceDTO(ProjectService service, List<TagService> tagServices, Category category) {
        this(
                service.getId(),
                "/-------.jpg",
                service.getTitle(),
                service.getPrice(),
                1, // rating
                1, // reviewCount
                service.getFreelancer().getNickname(),
                category.getName(),
                tagServices.stream()
                        .map(tagService -> tagService.getTag().getName())
                        .toArray(TagType[]::new),
                service.getContent(),
                service.getCreatedAt().toString()
        );
    }
    public static ServiceDTO from(ProjectService service, List<TagService> tagServices, Category category) {
        return new ServiceDTO(service, tagServices, category);
    }
}
