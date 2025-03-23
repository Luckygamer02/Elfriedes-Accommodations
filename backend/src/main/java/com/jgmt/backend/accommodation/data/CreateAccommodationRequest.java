package com.jgmt.backend.accommodation.data;

import com.jgmt.backend.accommodation.enums.AccommodationType;
import com.jgmt.backend.users.data.UserResponse;
import lombok.*;

import java.io.Serializable;
import java.util.List;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateAccommodationRequest implements Serializable {
    Long id;
    String title;
    String description;
    int basePrice;
    int bedrooms;
    int bathrooms;
    int people;
    int livingRooms;
    AccommodationType type;
    Long festivalistId;
    CreateAddressRequest address;
    CreateAccommodationFeatureRequest features;
    List<CreateAppliedDiscountRequest> appliedDiscounts;
    List<CreateExtraRequest> extras;
    UserResponse owner;
}