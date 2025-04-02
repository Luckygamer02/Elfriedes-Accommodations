package com.jgmt.backend.accommodation.infrastructure.controller.data;

import com.jgmt.backend.accommodation.domain.*;
import com.jgmt.backend.accommodation.domain.enums.BookingStatus;
import com.jgmt.backend.users.User;
import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class BookingResponse implements Serializable {
    User user;
    private Accommodation accommodation;
    private LocalDate checkInDate;
    private LocalDateTime checkOutDate;
    private BookingStatus status;
    private BigDecimal totalPrice;
    private List<BookedExtra> bookedExtras;
    private List<Payment> payments;
    private List<AppliedDiscount> appliedDiscounts;

    public BookingResponse(Booking booking) {
        this.user = booking.getUser();
        this.accommodation = booking.getAccommodation();
        this.checkInDate = booking.getCheckInDate();
        this.status = booking.getStatus();
        this.totalPrice = booking.getTotalPrice();
        this.bookedExtras = booking.getBookedExtras();
        this.payments = booking.getPayments();
        this.appliedDiscounts = booking.getAppliedDiscounts();
    }
}
