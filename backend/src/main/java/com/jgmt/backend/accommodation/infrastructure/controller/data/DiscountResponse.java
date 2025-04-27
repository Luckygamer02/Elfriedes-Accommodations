package com.jgmt.backend.accommodation.infrastructure.controller.data;

import com.jgmt.backend.accommodation.domain.Discount;
import lombok.*;

import java.util.Date;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class DiscountResponse {
    private float discountprocent;
    private String name;
    private Date expiringDate;
    private Date startDate;

    public DiscountResponse(Discount discount) {
        this.discountprocent = discount.getDiscountprocent();
        this.name = discount.getName();
        this.expiringDate = discount.getExpiringDate();
        this.startDate = discount.getStartDate();
    }
}
