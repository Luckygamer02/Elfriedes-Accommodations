package com.jgmt.backend.accommodation.infrastructure.controller.data;

import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateAppliedDiscountRequest implements Serializable {
    private Long id;
    private CreateDiscountRequest discount;
    private LocalDateTime appliedDate;
}