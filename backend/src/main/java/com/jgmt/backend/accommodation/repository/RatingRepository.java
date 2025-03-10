package com.jgmt.backend.accommodation.repository;


import com.jgmt.backend.accommodation.Rating;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RatingRepository extends JpaRepository<Rating, Long> {
}
