package com.jgmt.backend.accommodation;

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
    private Accommodation accommodation;

    @ManyToOne
    private Discount discount;

    private LocalDateTime appliedDate;
}
