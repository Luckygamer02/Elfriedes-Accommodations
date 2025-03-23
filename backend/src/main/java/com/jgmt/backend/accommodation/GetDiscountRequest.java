package com.jgmt.backend.accommodation;

import lombok.Value;

import java.io.Serializable;
import java.util.Date;

/**
 * DTO for {@link Discount}
 */
@Value
public class GetDiscountRequest implements Serializable {
    Long id;
    float discountprocent;
    String name;
    Date expioringdate;
}