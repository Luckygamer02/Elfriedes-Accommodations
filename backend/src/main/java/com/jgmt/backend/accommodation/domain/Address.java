package com.jgmt.backend.accommodation.domain;

import com.jgmt.backend.accommodation.infrastructure.controller.data.CreateAddressRequest;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;






public record Address(
        @NotBlank(message = "Street cannot be blank")
        @Size(min = 2, max = 100, message = "Street must be between {min} and {max} characters")
        String street,

        @NotBlank(message = "City cannot be blank")
        @Size(min = 2, max = 50, message = "City must be between {min} and {max} characters")
        String city,

        @NotBlank(message = "Country cannot be blank")
        @Size(min = 2, max = 56, message = "Country must be between {min} and {max} characters")
        @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "Country must contain only letters and spaces")
        String country,

        @NotBlank(message = "Postal code cannot be blank")
        @Size(min = 4, max = 10, message = "Postal code must be between {min} and {max} characters")
        @Pattern(regexp = "^[a-zA-Z0-9\\-]+$", message = "Invalid postal code format")
        String postalCode,

        @NotBlank(message = "House number cannot be blank")
        @Size(min = 1, max = 10, message = "House number must be between {min} and {max} characters")
        @Pattern(regexp = "^[0-9]+[a-zA-Z]?$", message = "Invalid house number format")
        String houseNumber
) {

    public Address( CreateAddressRequest request) {
        this(
                request.getStreet(),
                request.getCity(),
                request.getCountry(),
                request.getPostalCode(),
                request.getHouseNumber()
        );
    }

}
