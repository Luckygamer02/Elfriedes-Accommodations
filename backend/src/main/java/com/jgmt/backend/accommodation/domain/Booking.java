package com.jgmt.backend.accommodation.domain;

import com.jgmt.backend.accommodation.domain.enums.BookingStatus;
import com.jgmt.backend.accommodation.infrastructure.controller.data.BookingDTO;
import com.jgmt.backend.entity.AbstractEntity;
import com.jgmt.backend.users.User;
import com.jgmt.backend.util.Client;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Client
public class Booking extends AbstractEntity{

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    @Column(nullable = true)
    private String firstName;

    @Column(nullable = true)
    private String lastName;

    @Column(nullable = true)
    @Email
    private String email;



    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "accommodation_id", nullable = false)
    private Accommodation accommodation;

    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date checkInDate;

    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date checkOutDate;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    @Positive
    @Column(nullable = false)
    private int people;

    @Column(nullable = false)
    private BigDecimal totalPrice;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<BookedExtra> bookedExtras = new ArrayList<>();

   @Embedded
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

    public Booking(BookingDTO dto, User user, Accommodation accommodation) {
        this.user = user;
        this.accommodation = accommodation;
        this.firstName = dto.getFirstName();
        this.lastName = dto.getLastName();
        this.email = dto.getEmail();
        this.checkInDate = dto.getCheckInDate();
        this.checkOutDate = dto.getCheckOutDate();
        this.status = dto.getStatus();
        this.people = dto.getPeople();
        this.totalPrice = dto.getTotalPrice();
        this.bookedExtras = dto.getBookedExtras();
        this.payment = dto.getPayment();
        this.appliedDiscounts = dto.getAppliedDiscounts();
    }
}
