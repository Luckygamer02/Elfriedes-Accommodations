package com.jgmt.backend.accommodation.data;

import com.jgmt.backend.accommodation.Accommodation;
import com.jgmt.backend.accommodation.Address;
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
public class AccommodationResponse extends CreateExtraRequest implements Serializable {
    Long id;
    String title;
    String description;
    int basePrice;
    int bedrooms;
    int bathrooms;
    int people;
    int livingRooms;
    AccommodationType type;
    Address address;
    Long festivalistId;


    public AccommodationResponse(Accommodation accommodation) {
        this.id = accommodation.getId();
        this.title = accommodation.getTitle();
        this.description = accommodation.getDescription();
        this.basePrice = accommodation.getBasePrice();
        this.bedrooms = accommodation.getBedrooms();
        this.bathrooms = accommodation.getBathrooms();
        this.people = accommodation.getPeople();
        this.livingRooms = accommodation.getLivingRooms();
        this.type = accommodation.getType();
        this.address = accommodation.getAddress();
        this.festivalistId = accommodation.getFestivalistId();

    }
}