package com.jgmt.backend.accommodation.repository;

import com.jgmt.backend.accommodation.AccommodationFeature;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccommodationFeatureRepository extends JpaRepository<AccommodationFeature, Long> {
  }