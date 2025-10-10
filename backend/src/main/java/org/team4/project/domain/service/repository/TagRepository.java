package org.team4.project.domain.service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.team4.project.domain.service.entity.category.Tag;
import org.team4.project.domain.service.entity.category.type.TagType;


public interface TagRepository extends JpaRepository<Tag,Long> {
    @Query("SELECT t FROM Tag t WHERE t.name = :name")
    Tag findByName(@Param("name") TagType name);
}
