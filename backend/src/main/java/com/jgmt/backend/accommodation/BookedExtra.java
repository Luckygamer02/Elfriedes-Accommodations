package com.jgmt.backend.accommodation;

import com.jgmt.backend.entity.AbstractEntity;
import com.jgmt.backend.util.Client;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Client
public class BookedExtra extends AbstractEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "extra_id")
    private Extra extra;

    private int quantity;

    @Column(precision = 10, scale = 2)
    private BigDecimal appliedPrice;
}
