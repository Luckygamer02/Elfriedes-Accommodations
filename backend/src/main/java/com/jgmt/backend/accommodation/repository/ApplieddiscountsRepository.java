package com.jgmt.backend.accommodation.repository;


import com.jgmt.backend.accommodation.Applieddiscounts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApplieddiscountsRepository extends JpaRepository<Applieddiscounts, Long> {
}
