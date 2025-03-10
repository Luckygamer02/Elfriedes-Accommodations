package com.jgmt.backend.accommodation.repository;

import com.jgmt.backend.accommodation.Discounts;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiscountsRepository extends JpaRepository<Discounts, Long> {
}
