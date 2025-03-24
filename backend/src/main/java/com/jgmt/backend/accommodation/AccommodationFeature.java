package com.jgmt.backend.accommodation;

import com.jgmt.backend.accommodation.data.CreateAccommodationFeatureRequest;
import com.jgmt.backend.entity.AbstractEntity;
import com.jgmt.backend.util.Client;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Client
public class AccommodationFeature extends AbstractEntity {
    private boolean ac;
    private boolean garden;
    private boolean kitchen;
    private boolean microwave;
    private boolean meetingTable;
    private boolean pool;
    private boolean tv;
    private boolean washingMachine;
    private boolean wifi;
    @OneToOne(mappedBy = "features")
    private Accommodation accommodation;

    public AccommodationFeature(CreateAccommodationFeatureRequest features) {
        this.ac = features.isAc();
        this.garden = features.isGarden();
        this.kitchen = features.isKitchen();
        this.microwave = features.isMicrowave();
        this.meetingTable = features.isMeetingTable();
        this.pool = features.isPool();
        this.tv = features.isTv();
        this.washingMachine = features.isWashingMachine();
        this.wifi = features.isWifi();
    }
}
