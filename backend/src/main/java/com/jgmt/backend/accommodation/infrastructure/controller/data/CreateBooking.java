package com.jgmt.backend.accommodation.infrastructure.controller.data;

import com.jgmt.backend.accommodation.domain.Accommodation;
import com.jgmt.backend.accommodation.domain.AppliedDiscount;
import com.jgmt.backend.accommodation.domain.BookedExtra;
import com.jgmt.backend.accommodation.domain.Payment;
import com.jgmt.backend.accommodation.domain.enums.BookingStatus;
import com.jgmt.backend.users.User;
import jakarta.validation.constraints.NotNull;
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
public class CreateBooking {
        @NotNull
        User user;
        @NotNull
        private Long AccommodationId;
        @NotNull
        private LocalDate checkInDate;
        @NotNull
        private LocalDateTime checkOutDate;
        @NotNull
        private BookingStatus status;
        @NotNull
        private BigDecimal totalPrice;
        @NotNull
        private List<BookedExtra> bookedExtras;
        @NotNull
        private List<Payment> payments;
        @NotNull
        private List<AppliedDiscount> appliedDiscounts;


}
