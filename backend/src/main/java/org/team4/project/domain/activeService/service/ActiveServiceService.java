package org.team4.project.domain.activeService.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.team4.project.domain.activeService.entity.ActiveService;
import org.team4.project.domain.activeService.repository.ActiveServiceRepository;
import org.team4.project.domain.payment.entity.Payment;
import org.team4.project.domain.payment.service.PaymentService;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ActiveServiceService {
    private final ActiveServiceRepository activeServiceRepository;
    private final PaymentService paymentService;

    @Transactional
    public void createActiveService(String paymentKey) {
        Payment payment = paymentService.findPaymentById(paymentKey);

        ActiveService activeService = new ActiveService(payment);

        activeServiceRepository.save(activeService);
    }

    public List<ActiveService> findActiveServicesByMemberId(Long id) {
        return activeServiceRepository.findByFreelancer_IdOrClient_Id(id, id);
    }

    public void updateActiveServiceStatus(long id) {
        ActiveService activeService = activeServiceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 활성 서비스입니다."));

        activeService.setFinished(true);
        activeServiceRepository.save(activeService);
    }
}
