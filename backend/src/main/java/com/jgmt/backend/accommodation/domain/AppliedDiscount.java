package com.jgmt.backend.accommodation.domain;


import com.jgmt.backend.accommodation.infrastructure.controller.data.CreateDiscountRequest;
import com.jgmt.backend.entity.AbstractEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class AppliedDiscount extends AbstractEntity {

    @ManyToOne
    private Discount discount;

    private LocalDateTime appliedDate;

    @ManyToOne
    @JoinColumn(name = "accommodation_id")
    private Accommodation accommodation;

    @ManyToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;

    public AppliedDiscount(CreateDiscountRequest discountRequest) {
        this.appliedDate = LocalDateTime.now();
        this.discount = new Discount(discountRequest);

    }
    public void setAccommodation(Accommodation accommodation) { this.accommodation = accommodation; }
    public void setBooking(Booking booking) {
        this.booking = booking;
    }

}
