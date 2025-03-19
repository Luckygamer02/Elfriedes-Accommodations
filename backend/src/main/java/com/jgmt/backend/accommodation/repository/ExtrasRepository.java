package com.jgmt.backend.accommodation.repository;


import com.jgmt.backend.accommodation.Extras;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExtrasRepository extends JpaRepository<Extras, Long> {
}
