package com.jgmt.backend.accommodation.domain.repository;

import com.jgmt.backend.accommodation.domain.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}