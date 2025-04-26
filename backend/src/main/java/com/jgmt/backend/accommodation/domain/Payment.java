package com.jgmt.backend.accommodation.domain;

import com.jgmt.backend.accommodation.domain.enums.PaymentMethod;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;

@Embeddable
public record Payment(
    @NonNull
     BigDecimal amount,
    @NonNull
     PaymentMethod method,
    @Nullable
    Date paymentDate,
     @Nullable
     String last4,
     @Nullable
     String expiry
    ){

    }

