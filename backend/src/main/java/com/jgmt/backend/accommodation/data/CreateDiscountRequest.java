package com.jgmt.backend.accommodation.data;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateDiscountRequest implements Serializable {
    private float discountprocent;
    private String name;
    private Date expioringdate;
}
