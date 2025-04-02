package com.jgmt.backend.accommodation.domain;

import com.jgmt.backend.accommodation.infrastructure.controller.data.CreateAccommodationFeatureRequest;
import com.jgmt.backend.entity.AbstractEntity;
import com.jgmt.backend.util.Client;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


public record AccommodationFeature(
     boolean ac,
     boolean garden,
     boolean kitchen,
     boolean microwave,
     boolean meetingTable,
     boolean pool,
     boolean tv,
     boolean washingMachine,
     boolean wifi
    ){

    public AccommodationFeature(CreateAccommodationFeatureRequest features) {
        this(
        features.isAc(),
        features.isGarden(),
        features.isKitchen(),
        features.isMicrowave(),
        features.isMeetingTable(),
        features.isPool(),
        features.isTv(),
        features.isWashingMachine(),
        features.isWifi()
        );
    }
}
