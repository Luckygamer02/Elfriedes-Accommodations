package com.jgmt.backend.accommodation.domain.repository;

import com.jgmt.backend.accommodation.domain.AppliedDiscount;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppliedDiscountRepository extends JpaRepository<AppliedDiscount, Long> {
}