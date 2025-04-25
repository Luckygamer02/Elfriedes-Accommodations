package com.jgmt.backend.accommodation.infrastructure.controller.data;

import com.jgmt.backend.accommodation.domain.enums.AccommodationType;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * DTO for filtering accommodations based on search criteria.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FilterAccommodationDTO {
    /** Minimum base price filter */
    private Integer minBasePrice;
    /** Maximum base price filter */
    private Integer maxBasePrice;
    /** Number of bedrooms filter */
    private Integer bedrooms;
    /** Number of bathrooms filter */
    private Integer bathrooms;
    /** Number of people filter */
    private Integer people;
    /** Number of living rooms filter */
    private Integer livingRooms;
    /** Accommodation type filter */
    private AccommodationType type;
    /** Festivalist identifier filter */
    private Long festivalistId;
}
