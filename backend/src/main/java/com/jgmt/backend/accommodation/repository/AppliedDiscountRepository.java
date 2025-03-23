package com.jgmt.backend.accommodation.repository;

import com.jgmt.backend.accommodation.AppliedDiscount;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppliedDiscountRepository extends JpaRepository<AppliedDiscount, Long> {
}