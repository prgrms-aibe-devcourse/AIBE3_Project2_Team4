package org.team4.project.domain.service.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;
import org.team4.project.domain.service.entity.service.ProjectService;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<ProjectService, Long> {
    @Query("select s from ProjectService s join fetch s.freelancer")
    List<ProjectService> findAllWithFreelancer(Pageable pageable);
}
