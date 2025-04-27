package com.jgmt.backend.accommodation.domain.repository;

import com.jgmt.backend.accommodation.domain.Booking;
import com.jgmt.backend.accommodation.infrastructure.controller.data.BookingResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    @Query("SELECT b FROM Booking b")
    Page<BookingResponse> getAll(Pageable pageable);

    @Query("SELECT b from Booking b where b.user.id = :id ")
    Page<BookingResponse> getAllByUserId(@Param("id") Long id, Pageable pageable);

    @Query("SELECT b FROM Booking b where b.accommodation.id = :id")
    List<Booking> findBookingsByAccommodationId(@Param("id") Long accommodationId);

    @Query("select b from Booking b where  b.user.id = :userid")
    List<Booking> findBookingsByUserId(@Param("userid") Long userid);

    @Query("SELECT b from Booking b where b.id = :id")
    Optional<Booking> findBookingsById(Long id);

}