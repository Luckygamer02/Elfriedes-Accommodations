package com.jgmt.backend.accommodation.domain;

import com.jgmt.backend.entity.AbstractEntity;
import com.jgmt.backend.rating.RatingDto;
import com.jgmt.backend.util.Client;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.annotation.CreatedDate;

import java.sql.Timestamp;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Client
@Table(name = "rating")
public class Rating extends AbstractEntity {
    @NotNull
    private Long accommodationid;
    private Long userid;
    @NotNull
    private int rating;

    private String comment;

    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(updatable = false)
    private Timestamp createdOn;

    public Rating(RatingDto ratingDto) {
        this.userid = ratingDto.getUserid();
        this.rating = ratingDto.getRating();
        this.accommodationid = ratingDto.getAccommodationId();
        this.comment = ratingDto.getComment();
    }

}
