package org.team4.project.domain.service.repository;

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

    @Query(""" 
        select ts from TagService ts
        join fetch ts.tag t
        join fetch t.category c
        where c.name = :category
    """)
    List<TagService> findByCategory(@Param("category") CategoryType category,
                                    Pageable pageable);

    @Query(""" 
        select distinct ts from TagService ts
        join fetch ts.tag t
        where t.name in :tagType
    """)
    List<TagService> findByTags(@Param("tags") List<TagType> tagType,
                                Pageable pageable);
    @Query("""
        select ts from TagService ts
        join fetch ts.service s
        where s = :service
    """)
    List<TagService> findByService(@Param("service") ProjectService service);
}
