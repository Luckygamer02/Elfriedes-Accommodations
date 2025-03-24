package com.jgmt.backend.accommodation.data;

import com.jgmt.backend.accommodation.Address;
import com.jgmt.backend.accommodation.enums.AccommodationType;
import com.jgmt.backend.users.data.UserResponse;
import lombok.*;

import java.io.Serializable;
import java.util.List;


@Data
@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CreateAccommodationRequest implements Serializable {
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