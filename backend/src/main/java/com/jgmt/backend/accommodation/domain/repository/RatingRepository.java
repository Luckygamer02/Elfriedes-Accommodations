package com.jgmt.backend.accommodation.domain.repository;

import com.jgmt.backend.accommodation.domain.Rating;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    @Query("select avg(r.rating) rating From Rating r WHERE r.accommodationid = :accommodationid")
    Double getRatingforAccommodation(@Param("accommodationid") Long accommodationid);

    @Query("select r From Rating r WHERE r.accommodationid = :accommodationid")
    Page<Rating> findByaccommodationId(@Param("accommodationid") Long accommodationid , Pageable pageable);

}