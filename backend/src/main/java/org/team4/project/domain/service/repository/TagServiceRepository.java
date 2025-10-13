package org.team4.project.domain.service.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.team4.project.domain.service.entity.category.TagService;
import org.team4.project.domain.service.entity.category.type.CategoryType;
import org.team4.project.domain.service.entity.category.type.TagType;
import org.team4.project.domain.service.entity.service.ProjectService;

import java.util.List;

@Repository
public interface TagServiceRepository extends JpaRepository<TagService, Long> {

    @Query(
        value = """
            select ts from TagService ts
            join fetch ts.tag t
            join fetch t.category c
            where c.name = :category
        """,
        countQuery = """
            select count(ts) from TagService ts
            join ts.tag t
            join t.category c
            where c.name = :category
        """)
    Page<TagService> findByCategory(@Param("category") CategoryType category,
                                    Pageable pageable);

    @Query(
        value = """ 
            select distinct ts from TagService ts
            join fetch ts.tag t
            where t.name in :tags
        """,
        countQuery = """
            select count(distinct ts) from TagService ts
            join ts.tag t
            where t.name in :tags
    """)
    Page<TagService> findByTags(@Param("tags") List<TagType> tags,
                                Pageable pageable);
    @Query("""
        select ts from TagService ts
        join fetch ts.service s
        where s = :service
    """)
    List<TagService> findByService(@Param("service") ProjectService service);
}
