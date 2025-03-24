package com.jgmt.backend.accommodation;

import com.jgmt.backend.accommodation.data.CreateAddressRequest;
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

    public Address(CreateAddressRequest address) {
        this.street = address.getStreet();
        this.houseNumber = address.getHouseNumber();
        this.city = address.getCity();
        this.zipCode = address.getZipCode();
        this.country = address.getCountry();
    }
}
