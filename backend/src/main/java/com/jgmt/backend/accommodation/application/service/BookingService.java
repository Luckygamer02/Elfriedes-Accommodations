package com.jgmt.backend.accommodation.application.service;

import com.jgmt.backend.accommodation.domain.Accommodation;
import com.jgmt.backend.accommodation.domain.Booking;
import com.jgmt.backend.accommodation.domain.repository.BookingRepository;
import com.jgmt.backend.accommodation.infrastructure.controller.data.BookingResponse;
import com.jgmt.backend.accommodation.infrastructure.controller.data.CreateBooking;
import com.jgmt.backend.users.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepository;
    private final AccommodationService accommodationService;

    @Transactional
    public Page<BookingResponse> getAllBookings(Pageable pageable) {
        return bookingRepository.getAll(pageable);
    }
    @Transactional
    public Page<BookingResponse> getBookingById(Long id , Pageable pageable) {
        return bookingRepository.getAllByUserId(id , pageable);
    }
    @Transactional
    public BookingResponse createBooking(@Valid @NonNull CreateBooking request) {
        Booking booking = new Booking(request, accommodationService.getAccommodation(request.getAccommodationId()) );
        booking = bookingRepository.save(booking);
        return new BookingResponse(booking);

    }
}
