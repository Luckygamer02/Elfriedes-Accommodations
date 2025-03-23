package com.jgmt.backend.accommodation;

import com.jgmt.backend.accommodation.enums.BookingStatus;
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

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Payment> payments = new ArrayList<>();

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<AppliedDiscount> appliedDiscounts = new ArrayList<>();

    // Convenience methods
    public void addExtra(Extra extra, int quantity) {
        BookedExtra bookedExtra = new BookedExtra();
        bookedExtra.setBooking(this);
        bookedExtra.setExtra(extra);
        bookedExtra.setQuantity(quantity);
        bookedExtras.add(bookedExtra);
    }
}
