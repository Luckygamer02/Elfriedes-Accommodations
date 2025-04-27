package com.jgmt.backend.accommodation.domain;

import com.jgmt.backend.accommodation.infrastructure.controller.data.CreateDiscountRequest;
import com.jgmt.backend.entity.AbstractEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.util.Date;
import lombok.*;



@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "discount")
public class Discount extends AbstractEntity {

    private float discountprocent;
    private String name;
    private Date expiringDate;
    private Date startDate;
    @ManyToOne
    @JoinColumn(name = "accommodation_id")
    private Accommodation accommodation;

    public Discount(CreateDiscountRequest discount) {
        this.discountprocent = discount.getDiscountprocent();
        this.name = discount.getName();
        this.expiringDate = discount.getExpiringDate();
        this.startDate = discount.getStartDate();
    }

}