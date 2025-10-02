package org.team4.project.domain.service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.team4.project.domain.service.entity.service.ProjectService;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<ProjectService, Long> {
    // 최근 데이터부터 size개
    List<ProjectService> findTop10ByOrderByIdDesc();

    // 특정 id보다 작은 것만 size개
    List<ProjectService> findTop10ByIdLessThanOrderByIdDesc(Long lastId);
}
