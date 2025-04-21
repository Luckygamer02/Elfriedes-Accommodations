package com.jgmt.backend.accommodation.application.service;

import com.jgmt.backend.accommodation.domain.Accommodation;
import com.jgmt.backend.accommodation.domain.Booking;
import com.jgmt.backend.accommodation.domain.repository.BookingRepository;
import com.jgmt.backend.accommodation.infrastructure.controller.data.BookingDTO;
import com.jgmt.backend.accommodation.infrastructure.controller.data.BookingResponse;
import com.jgmt.backend.accommodation.infrastructure.controller.data.CreateBooking;
import com.jgmt.backend.accommodation.infrastructure.controller.data.DateRange;
import com.jgmt.backend.users.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepository;
    private final AccommodationService accommodationService;
    private final UserService userService;

    @Transactional
    public Page<BookingResponse> getAllBookings(Pageable pageable) {
        return bookingRepository.getAll(pageable);
    }
    @Transactional
    public Page<BookingResponse> getBookingById(Long id , Pageable pageable) {
        return bookingRepository.getAllByUserId(id , pageable);
    }
    @Transactional
    public BookingDTO createBooking(@Valid @NonNull BookingDTO request) {
        Booking booking = new Booking(request,userService.getUserById(request.getUserid()),accommodationService.getAccommodation(request.getAccommodationId()) );
        booking = bookingRepository.save(booking);
        return new BookingDTO(booking);
    }

    @Transactional(readOnly = true)
    public List<DateRange> getBookedDates(@Valid Long accommodationId) {
           List<Booking> getBooking = bookingRepository.findBookingByAccommodationId(accommodationId);
           List<DateRange> result = new ArrayList<DateRange>();
           for (Booking booking : getBooking) {
               result.add(DateRange.of(booking.getCheckInDate(), booking.getCheckOutDate()));
           }
           return result;
    }
}
