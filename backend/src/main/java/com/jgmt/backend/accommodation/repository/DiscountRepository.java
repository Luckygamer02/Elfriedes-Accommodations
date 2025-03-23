package com.jgmt.backend.accommodation.repository;

import com.jgmt.backend.accommodation.Discount;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiscountRepository extends JpaRepository<Discount, Long> {
}