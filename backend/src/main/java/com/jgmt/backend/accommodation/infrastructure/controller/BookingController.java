package com.jgmt.backend.accommodation.infrastructure.controller;

import com.jgmt.backend.accommodation.application.service.BookingService;
import com.jgmt.backend.accommodation.domain.Booking;
import com.jgmt.backend.accommodation.domain.repository.BookingRepository;
import com.jgmt.backend.accommodation.infrastructure.controller.data.BookingDTO;
import com.jgmt.backend.accommodation.infrastructure.controller.data.BookingResponse;
import com.jgmt.backend.accommodation.infrastructure.controller.data.DateRange;
import com.jgmt.backend.util.Client;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@Client
public class BookingController {
    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping("/getall")
    public ResponseEntity<Page<BookingResponse>> getAllBookings(Pageable pageable) {
        return ResponseEntity.ok(bookingService.getAllBookings(pageable));
    }

    @GetMapping("/bookeddates/{accommodationId}")
    public ResponseEntity<List<DateRange>> getAllBookedDates(@PathVariable Long accommodationId) {
        return ResponseEntity.ok(bookingService.getBookedDates(accommodationId));
    }

    @GetMapping("/user/{userid}")
    public ResponseEntity<List<BookingResponse>> getAllBookings(@PathVariable Long userid) {
        return ResponseEntity.ok(bookingService.getBookingByUserId(userid));
    }
    @GetMapping("accomodation/{accid}")
    public ResponseEntity<List<BookingResponse>> getAllBookingsforAccommodation(@PathVariable Long accid) {
        return ResponseEntity.ok(bookingService.getBookingByAccId(accid));
    }

    @GetMapping("/{bookingid}")
    public ResponseEntity<BookingResponse> getBooking(@PathVariable Long bookingid){
        return ResponseEntity.of(bookingService.getBookingbyId(bookingid));
    }
    @PostMapping
    public ResponseEntity<BookingDTO> createBooking(@RequestBody BookingDTO booking) {
        return ResponseEntity.ok(bookingService.createBooking(booking));
    }
}
