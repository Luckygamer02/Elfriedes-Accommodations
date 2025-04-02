package com.jgmt.backend.accommodation.domain;

import java.io.Serializable;
import java.util.Date;


public class GetDiscountRequest implements Serializable {
    Long id;
    float discountprocent;
    String name;
    Date expioringdate;
}