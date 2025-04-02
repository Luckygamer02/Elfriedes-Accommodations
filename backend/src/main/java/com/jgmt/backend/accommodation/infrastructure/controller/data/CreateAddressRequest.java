package com.jgmt.backend.accommodation.infrastructure.controller.data;

import lombok.*;

import java.io.Serializable;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateAddressRequest implements Serializable {
    Long id;
    String street;
    String houseNumber;
    String city;
    String zipCode;
    String country;
}