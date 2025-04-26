package com.jgmt.backend.accommodation.application.service;

import com.jgmt.backend.accommodation.domain.Booking;
import com.jgmt.backend.accommodation.domain.repository.BookingRepository;
import com.jgmt.backend.accommodation.infrastructure.controller.data.BookingDTO;
import com.jgmt.backend.accommodation.infrastructure.controller.data.BookingResponse;
import com.jgmt.backend.accommodation.infrastructure.controller.data.DateRange;
import com.jgmt.backend.accommodation.infrastructure.controller.job.SendBookingConformationJob;
import com.jgmt.backend.email.EmailService;
import com.jgmt.backend.users.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.jobrunr.scheduling.BackgroundJobRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepository;
    private final AccommodationService accommodationService;
    private final UserService userService;
    private final EmailService emailService;

    @Transactional
    public Page<BookingResponse> getAllBookings(Pageable pageable) {
        return bookingRepository.getAll(pageable);
    }

    @Transactional
    public BookingDTO createBooking(@Valid @NonNull BookingDTO request) {
        Booking booking = new Booking(request,userService.getUserById(request.getUserid()),accommodationService.getAccommodation(request.getAccommodationId()) );
        booking = bookingRepository.save(booking);
        SendBookingConformationJob job = new SendBookingConformationJob(booking.getId());
        BackgroundJobRequest.enqueue(job);
        return new BookingDTO(booking);
    }

    @Transactional(readOnly = true)
    public List<DateRange> getBookedDates(@Valid Long accommodationId) {
           List<Booking> getBooking = bookingRepository.findBookingsByAccommodationId(accommodationId);
           List<DateRange> result = new ArrayList<DateRange>();
           for (Booking booking : getBooking) {
               result.add(DateRange.of(booking.getCheckInDate(), booking.getCheckOutDate()));
           }
           return result;
    }
    @Transactional(readOnly = true)
    public List<BookingResponse> getBookingByUserId(Long userid) {
         return bookingRepository.findBookingsByUserId(userid).stream().map(BookingResponse::new).collect(Collectors.toList());
    }

    public Optional<BookingResponse> getBookingbyId(Long bookingid) {
        Booking booking = bookingRepository.findBookingsById(bookingid).orElse(null);
        return Optional.of(booking==null?null:new BookingResponse(booking));
    }

    public List<BookingResponse> getBookingByAccId(Long accid) {
        return bookingRepository.findBookingsByAccommodationId(accid).stream().map(BookingResponse::new).collect(Collectors.toList());
    }
}
