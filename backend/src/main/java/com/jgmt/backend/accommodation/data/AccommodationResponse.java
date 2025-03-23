package com.jgmt.backend.accommodation.data;

import com.jgmt.backend.accommodation.enums.AccommodationType;
import lombok.*;

import java.io.Serializable;

/**
 * DTO for {@link com.jgmt.backend.accommodation.Accommodation}
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AccommodationResponse implements Serializable {
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


}