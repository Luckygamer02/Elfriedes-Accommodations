package com.jgmt.backend.accommodation.domain.repository;

import com.jgmt.backend.accommodation.domain.Discount;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiscountRepository extends JpaRepository<Discount, Long> {
}