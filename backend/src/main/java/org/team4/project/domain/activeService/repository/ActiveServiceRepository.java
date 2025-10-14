package org.team4.project.domain.activeService.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.team4.project.domain.activeService.entity.ActiveService;

import java.util.List;

@Repository
public interface ActiveServiceRepository extends JpaRepository<ActiveService, Long> {
    @EntityGraph(attributePaths = {"client", "freelancer"})
    List<ActiveService> findByFreelancer_IdOrClient_Id(Long id1, Long id2);
}
