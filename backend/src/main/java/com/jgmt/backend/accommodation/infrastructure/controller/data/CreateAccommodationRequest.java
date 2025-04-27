package com.jgmt.backend.accommodation.infrastructure.controller.data;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.jgmt.backend.accommodation.domain.enums.AccommodationType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class CreateAccommodationRequest implements Serializable {
    @NotNull
    String title;
    @NotNull
    String description;

    @NotNull
    @Positive
    int basePrice;

    @NotNull
    int bedrooms;

    @NotNull
    @PositiveOrZero
    int bathrooms;

    @NotNull
    @Positive
    int people;

    @Positive
    @NotNull
    int livingRooms;

    @NotNull
    AccommodationType type;

    Long festivalId;  // Changed from festivalistId

    @NotNull
    Long ownerId;

    CreateAddressRequest address;
    CreateAccommodationFeatureRequest features;

    @JsonProperty("discounts")  // Map JSON field to Java property
    List<CreateDiscountRequest> discounts;  // Changed from appliedDiscounts

    List<CreateExtraRequest> extras;

    // Use a structure that matches the JSON
    List<PicturePosition> picturePositions;

    // Inner class to match the JSON structure
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PicturePosition {
        private int index;
        private int position;
    }
}