package org.team4.project.domain.service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.team4.project.domain.service.entity.service.ProjectService;

@Repository
public interface ServiceRepository extends JpaRepository<ProjectService, Long> {
}
