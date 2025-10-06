package org.team4.project.domain.service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.team4.project.domain.service.entity.category.Tag;
import org.team4.project.domain.service.entity.category.type.TagType;


public interface TagRepository extends JpaRepository<Tag,Long> {
    Tag findByName(TagType name);
}
