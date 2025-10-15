package org.team4.project.domain.service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.team4.project.domain.service.entity.resource.ServiceResource;
import org.team4.project.domain.service.entity.service.ProjectService;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceResourceRepository extends JpaRepository<ServiceResource,Long> {
    List<ServiceResource> findByProjectService(ProjectService projectService);

    @Query("SELECT sr FROM ServiceResource sr WHERE sr.projectService.id = :serviceId AND sr.isRepresentative = true")
    Optional<ServiceResource> findByProjectServiceAndIsRepresentative(@Param("serviceId") Long serviceId);
}
