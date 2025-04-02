package com.jgmt.backend.accommodation.domain.repository;

import com.jgmt.backend.accommodation.domain.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    @Query("select avg(r.rating) rating From Rating r WHERE r.accommodationid = :accommodationid")
    Integer getRatingforAccommodation(@Param("accommodationid") Long accommodationid);
}