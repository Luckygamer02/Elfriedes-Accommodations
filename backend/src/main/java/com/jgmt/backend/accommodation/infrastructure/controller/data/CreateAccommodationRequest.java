package com.jgmt.backend.accommodation.infrastructure.controller.data;

import com.jgmt.backend.accommodation.domain.enums.AccommodationType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.Serializable;
import java.util.List;


@Data
@Builder
@Getter
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
    @Positive
    int bathrooms;
    @NotNull
    @Positive
    int people;
    @Positive
    @NotNull
    int livingRooms;
    @NotNull
    AccommodationType type;

    Long festivalistId;
    @NotNull
    Long ownerId;
    CreateAddressRequest address;
    CreateAccommodationFeatureRequest features;
    List<CreateAppliedDiscountRequest> appliedDiscounts;
    List<CreateExtraRequest> extras;
    List<MultipartFile> pictures;


}