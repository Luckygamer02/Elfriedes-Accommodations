package com.jgmt.backend.accommodation;

import com.jgmt.backend.entity.AbstractEntity;
import jakarta.persistence.Entity;
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
    private Date expioringdate;
}