package com.jgmt.backend.accommodation.repository;

import com.jgmt.backend.accommodation.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {
}