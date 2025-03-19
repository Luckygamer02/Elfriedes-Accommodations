package com.jgmt.backend.accommodation.repository;


import com.jgmt.backend.accommodation.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
}
