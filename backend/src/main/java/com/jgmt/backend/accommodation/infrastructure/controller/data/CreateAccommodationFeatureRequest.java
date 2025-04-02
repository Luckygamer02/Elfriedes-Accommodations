package com.jgmt.backend.accommodation.infrastructure.controller.data;

import lombok.*;

import java.io.Serializable;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateAccommodationFeatureRequest implements Serializable {
    Long id;
    boolean ac;
    boolean garden;
    boolean kitchen;
    boolean microwave;
    boolean meetingTable;
    boolean pool;
    boolean tv;
    boolean washingMachine;
    boolean wifi;
}