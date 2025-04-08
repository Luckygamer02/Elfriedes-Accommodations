package com.jgmt.backend.accommodation.domain;

import com.jgmt.backend.accommodation.application.service.AccommodationService;
import com.jgmt.backend.accommodation.domain.enums.BookingStatus;
import com.jgmt.backend.accommodation.infrastructure.controller.data.CreateBooking;
import com.jgmt.backend.entity.AbstractEntity;
import com.jgmt.backend.users.User;
import com.jgmt.backend.util.Client;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Client
public class Booking extends AbstractEntity{

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "accommodation_id", nullable = false)
    private Accommodation accommodation;

    @Column(nullable = false)
    private LocalDate checkInDate;

    @Column(nullable = false)
    private LocalDate checkOutDate;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    @Column(nullable = false)
    private BigDecimal totalPrice;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<BookedExtra> bookedExtras = new ArrayList<>();

    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    private Payment payment;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<AppliedDiscount> appliedDiscounts = new ArrayList<>();


    // Add helper methods
    public void addAppliedDiscount(AppliedDiscount discount) {
        appliedDiscounts.add(discount);
        discount.setBooking(this);
    }

    public void removeAppliedDiscount(AppliedDiscount discount) {
        appliedDiscounts.remove(discount);
        discount.setBooking(null);
    }
    // Convenience methods
    public void addExtra(Extra extra, int quantity) {
        BookedExtra bookedExtra = new BookedExtra();
        bookedExtra.setBooking(this);
        bookedExtra.setExtra(extra);
        bookedExtra.setQuantity(quantity);
        bookedExtras.add(bookedExtra);
    }
    public Booking(CreateBooking booking, Accommodation accommodation) {
        this.user = booking.getUser();
        this.accommodation = accommodation;
        this.checkInDate = booking.getCheckInDate();
        this.checkOutDate = LocalDate.now();
        this.status = booking.getStatus();
        this.totalPrice = booking.getTotalPrice();
        this.bookedExtras = booking.getBookedExtras();
        this.payment = booking.getPayments();
        this.appliedDiscounts = booking.getAppliedDiscounts();
    }
}
