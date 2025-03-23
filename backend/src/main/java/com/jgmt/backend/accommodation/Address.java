package com.jgmt.backend.accommodation;

import com.jgmt.backend.entity.AbstractEntity;
import com.jgmt.backend.util.Client;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Client
@Table(name = "adress")
public class Address extends AbstractEntity {
    private String street;
    private String houseNumber;
    private String city;
    private String zipCode;
    private String country;
}
