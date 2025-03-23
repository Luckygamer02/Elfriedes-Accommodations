package com.jgmt.backend.accommodation.data;

import com.jgmt.backend.accommodation.GetDiscountRequest;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateAppliedDiscountRequest implements Serializable {
    private Long id;
    private GetDiscountRequest discount;
    private LocalDateTime appliedDate;
}