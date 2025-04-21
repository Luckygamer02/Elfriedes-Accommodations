package com.jgmt.backend.accommodation.infrastructure.controller.data;

import com.jgmt.backend.accommodation.domain.*;
import com.jgmt.backend.accommodation.domain.enums.AccommodationType;
import jakarta.persistence.Column;
import lombok.*;

import java.io.Serializable;
import java.util.List;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AccommodationResponse implements Serializable {
    Long id;
    String title;
    String description;
    @Column(name = "baseprice", nullable = false)
    int basePrice;
    @Column(name = "bedrooms", nullable = false)
    int bedrooms;
    @Column(name = "bathrooms", nullable = false)
    int bathrooms;
    int people;
    int livingRooms;
    AccommodationType type;
    Address address;
    Long festivalistId;
    AccommodationFeature features;
    List<Extra> extras;



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
        this.features = accommodation.getFeatures();
        this.extras = accommodation.getExtras();

    }
}