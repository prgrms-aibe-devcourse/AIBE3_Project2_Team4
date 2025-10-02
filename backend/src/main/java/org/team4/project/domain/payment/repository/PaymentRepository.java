package org.team4.project.domain.payment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.team4.project.domain.payment.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, String> {
}