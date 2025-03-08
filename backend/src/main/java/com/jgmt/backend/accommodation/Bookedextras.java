package com.jgmt.backend.accommodation;

import com.jgmt.backend.entity.AbstractEntity;
import jakarta.persistence.OneToOne;

public class Bookedextras extends AbstractEntity {
    @OneToOne
    private Long bookingid;
    @OneToOne
    private Long extraid;
}
