package com.jgmt.backend.accommodation.repository;

import com.jgmt.backend.accommodation.Accommodation;
import com.jgmt.backend.accommodation.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
}
