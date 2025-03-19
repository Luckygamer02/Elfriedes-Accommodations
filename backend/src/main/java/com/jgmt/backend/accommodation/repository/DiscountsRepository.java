package com.jgmt.backend.accommodation.repository;

import com.jgmt.backend.accommodation.Discounts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DiscountsRepository extends JpaRepository<Discounts, Long> {
}
