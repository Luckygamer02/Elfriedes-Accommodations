package com.jgmt.backend.accommodation.infrastructure.controller.data;
import com.jgmt.backend.accommodation.domain.*;
import com.jgmt.backend.accommodation.domain.enums.BookingStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingDTO {

        @NotNull
        private Payment payment;

        private Long userid;

        private String firstName;

        private String lastName;

        @Email
        private String email;

        @NotNull
        private Long accommodationId;

        @NotNull
        @FutureOrPresent
        private Date checkInDate;

        @NotNull
        @FutureOrPresent
        private Date checkOutDate;

        @NotNull
        private BookingStatus status;

        @Positive
        private int people;

        @NotNull
        private BigDecimal totalPrice;

        private List<BookedExtra> bookedExtras;


        private List<AppliedDiscount> appliedDiscounts;


    public BookingDTO(Booking booking) {
        if(booking.getUser() != null) {
            this.userid = booking.getUser().getId();
        }

        this.firstName = booking.getFirstName();
        this.lastName = booking.getLastName();
        this.email = booking.getEmail();

        this.accommodationId = booking.getAccommodation().getId();

        this.checkInDate = booking.getCheckInDate();
        this.checkOutDate = booking.getCheckOutDate();
        this.status = booking.getStatus();
        this.people = booking.getPeople();
        this.totalPrice = booking.getTotalPrice();

        this.bookedExtras = booking.getBookedExtras();

        this.payment = booking.getPayment();

        this.appliedDiscounts = booking.getAppliedDiscounts();
    }

}
