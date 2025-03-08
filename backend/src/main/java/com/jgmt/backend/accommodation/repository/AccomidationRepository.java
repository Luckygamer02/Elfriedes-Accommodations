package com.jgmt.backend.accommodation.repository;

import com.jgmt.backend.accommodation.Accommodation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccomidationRepository extends JpaRepository<Accommodation, Long> {

}
