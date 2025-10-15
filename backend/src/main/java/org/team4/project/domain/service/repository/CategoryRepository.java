package org.team4.project.domain.service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.team4.project.domain.service.entity.category.Category;
import org.team4.project.domain.service.entity.category.type.CategoryType;

@Repository
public interface CategoryRepository extends JpaRepository<Category,Long> {
}
