package com.jgmt.backend.accommodation.infrastructure.controller;

import com.jgmt.backend.accommodation.application.service.BookingService;
import com.jgmt.backend.accommodation.domain.Booking;
import com.jgmt.backend.accommodation.domain.repository.BookingRepository;
import com.jgmt.backend.accommodation.infrastructure.controller.data.BookingResponse;
import com.jgmt.backend.util.Client;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/booking")
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
}
