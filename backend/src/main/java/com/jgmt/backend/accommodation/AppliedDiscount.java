package com.jgmt.backend.accommodation;

import com.jgmt.backend.accommodation.data.CreateAppliedDiscountRequest;
import com.jgmt.backend.entity.AbstractEntity;
import com.jgmt.backend.util.Client;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Client
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

    public AppliedDiscount(CreateAppliedDiscountRequest discountRequest) {
        this.appliedDate = LocalDateTime.now();
        this.discount = new Discount(discountRequest.getDiscount());

    }
    public void setAccommodation(Accommodation accommodation) { this.accommodation = accommodation; }
    public void setBooking(Booking booking) {
        this.booking = booking;
    }

}
