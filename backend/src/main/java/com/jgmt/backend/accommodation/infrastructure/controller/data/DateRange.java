package com.jgmt.backend.accommodation.infrastructure.controller.data;

import java.util.Date;

public record DateRange(
        Date from,
        Date to
){
    public static DateRange of(Date from, Date to) {
        return new DateRange(from, to);
    }
}
