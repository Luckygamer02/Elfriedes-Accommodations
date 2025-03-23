package com.jgmt.backend.accommodation;

import com.jgmt.backend.entity.AbstractEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;

@Entity
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
}
