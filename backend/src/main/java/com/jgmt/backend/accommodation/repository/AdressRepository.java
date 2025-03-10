package com.jgmt.backend.accommodation.repository;

import com.jgmt.backend.accommodation.Accommodation;
import com.jgmt.backend.accommodation.Adress;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdressRepository extends JpaRepository<Adress, Long> {
}
