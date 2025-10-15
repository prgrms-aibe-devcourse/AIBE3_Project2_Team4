package org.team4.project.domain.activeService.repository;

import org.springframework.data.domain.Limit;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.team4.project.domain.activeService.entity.ActiveService;
import org.team4.project.domain.member.entity.Member;

import java.util.List;
import java.util.Optional;

@Repository
public interface ActiveServiceRepository extends JpaRepository<ActiveService, Long> {
    @EntityGraph(attributePaths = {"client", "freelancer"})
    List<ActiveService> findDistinctByFreelancer_IdOrClient_Id(Long id1, Long id2);

    Optional<ActiveService> findByIdAndClient_Id(Long id, Long clientId);

    boolean existsByPayment_PaymentKey(String paymentKey);
}
