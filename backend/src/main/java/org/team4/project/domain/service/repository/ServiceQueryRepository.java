package org.team4.project.domain.service.repository;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Repository;
import org.team4.project.domain.service.dto.ServiceDTO;
import org.team4.project.domain.service.entity.category.Category;
import org.team4.project.domain.service.entity.category.Tag;
import org.team4.project.domain.service.entity.category.type.CategoryType;
import org.team4.project.domain.service.entity.category.type.TagType;
import org.team4.project.domain.service.entity.service.ProjectService;

import java.util.List;

import static org.team4.project.domain.file.entity.QFile.file;
import static org.team4.project.domain.member.entity.QMember.member;
import static org.team4.project.domain.service.entity.category.QCategory.category;
import static org.team4.project.domain.service.entity.category.QTag.tag;
import static org.team4.project.domain.service.entity.category.QTagService.tagService;
import static org.team4.project.domain.service.entity.resource.QServiceResource.serviceResource;
import static org.team4.project.domain.service.entity.reviews.QServiceReview.serviceReview;
import static org.team4.project.domain.service.entity.service.QProjectService.projectService;

@Repository
@RequiredArgsConstructor
public class ServiceQueryRepository {

    private final JPAQueryFactory queryFactory;

    public Page<ServiceDTO> getServicesByCategory(Pageable pageable, CategoryType categoryType) {
        JPQLQuery<Category> cate = JPAExpressions.selectFrom(category)
                                                 .where(category.name.eq(categoryType));

        List<Tag> tags = queryFactory.selectFrom(tag)
                                     .where(tag.category.eq(cate))
                                     .fetch();
        List<TagType> tagTypes = tags.stream()
                                     .map(Tag::getName)
                                     .toList();

        return temp(pageable, tagTypes, categoryType);
    }

    public Page<ServiceDTO> getServicesByTags(Pageable pageable, List<TagType> tagTypes) {
        CategoryType categoryType = queryFactory.select(tag.category.name)
                                                .from(tag)
                                                .where(tag.name.in(tagTypes))
                                                .fetchFirst();
        return temp(pageable, tagTypes, categoryType);
    }

    private Page<ServiceDTO> temp(Pageable pageable, List<TagType> tagTypes, CategoryType categoryType) {
        TagType[] types = tagTypes.toArray(TagType[]::new);

        List<ServiceDTO> content = queryFactory.select(Projections.constructor(ServiceDTO.class,
                                                       projectService.id,
                                                       file.s3Url,
                                                       projectService.title,
                                                       projectService.price,
                                                       serviceReview.rating.avg().floatValue().coalesce(0f),
                                                       serviceReview.id.countDistinct().intValue().coalesce(0),
                                                       member.nickname,
                                                       Expressions.constant(categoryType),
                                                       Expressions.constant(types),
                                                       projectService.content,
                                                       projectService.createdAt.stringValue()
                                               ))
                                               .from(projectService)
                                               .join(tagService).on(tagService.service.eq(projectService))
                                               .join(tag).on(tagService.tag.eq(tag))
                                               .leftJoin(serviceResource).on(serviceResource.projectService.eq(projectService)
                                                                                                           .and(serviceResource.isRepresentative.isTrue()))
                                               .leftJoin(serviceResource.file, file)
                                               .leftJoin(serviceReview).on(serviceReview.service.eq(projectService))
                                               .leftJoin(projectService.freelancer, member)
                                               .where(tag.name.in(tagTypes))
                                               .groupBy(projectService.id,
                                                       file.s3Url,
                                                       projectService.title,
                                                       projectService.price,
                                                       member.nickname,
                                                       projectService.content,
                                                       projectService.createdAt)
                                               .offset(pageable.getOffset())
                                               .limit(pageable.getPageSize())
                                               .fetch();

        JPQLQuery<Long> countQuery = queryFactory.select(projectService.id.countDistinct())
                                                 .from(tagService)
                                                 .join(tagService.service, projectService)
                                                 .join(tagService.tag, tag)
                                                 .where(tag.name.in(tagTypes));

        return PageableExecutionUtils.getPage(content, pageable, countQuery::fetchOne);
    }
}
