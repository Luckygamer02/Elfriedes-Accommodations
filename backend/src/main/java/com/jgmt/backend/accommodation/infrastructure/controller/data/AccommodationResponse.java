package com.jgmt.backend.accommodation.infrastructure.controller.data;

import com.jgmt.backend.accommodation.domain.*;
import com.jgmt.backend.accommodation.domain.enums.AccommodationType;
import com.jgmt.backend.s3.UploadedFile;
import jakarta.persistence.Column;
import lombok.*;
import lombok.extern.slf4j.Slf4j;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@Slf4j
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
    Long ownerId;
    AccommodationType type;
    Address address;
    Long festivalistId;
    AccommodationFeature features;
    List<Extra> extras;
    List<DiscountResponse> discounts;
    double avgRating;
    /**
     * Image URLS
     */
    List<String> picturesurls;
    private LocalDateTime createdAt;


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
        this.ownerId = accommodation.getOwner().getId();
        this.picturesurls = accommodation.getPictures();
        this.createdAt = accommodation.getCreatedAt();
        this.discounts =  accommodation.getDiscounts().stream().map(DiscountResponse::new).collect(Collectors.toList());
    }
}