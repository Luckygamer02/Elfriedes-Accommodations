package com.jgmt.backend.accommodation.repository;

import com.jgmt.backend.accommodation.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
}
