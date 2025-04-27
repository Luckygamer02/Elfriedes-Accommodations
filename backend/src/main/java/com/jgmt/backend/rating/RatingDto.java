package com.jgmt.backend.rating;

import jakarta.validation.constraints.NotNull;
import lombok.Value;
import org.hibernate.validator.constraints.Range;

import java.io.Serializable;

/**
 * DTO for {@link com.jgmt.backend.accommodation.domain.Rating}
 */
@Value
public class RatingDto implements Serializable {
    @NotNull
    Long accommodationId;
    Long userid;
    @Range(min = 0, max = 5)
    int rating;
    @NotNull
    String comment;
}