package com.jgmt.backend.accommodation.infrastructure.controller.data;

import com.jgmt.backend.accommodation.domain.enums.AccommodationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateAccommodation implements Serializable {
    String title;
    String description;
    int basePrice;
    int bedrooms;
    int bathrooms;
    int people;
    int livingRooms;
    AccommodationType type;
    Long festivalistId;
    Long ownerId;
    CreateAddressRequest address;
    CreateAccommodationFeatureRequest features;
    List<CreateAppliedDiscountRequest> appliedDiscounts;
    List<CreateExtraRequest> extras;
}
