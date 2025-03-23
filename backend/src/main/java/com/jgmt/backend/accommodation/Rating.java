package com.jgmt.backend.accommodation;

import com.jgmt.backend.entity.AbstractEntity;
import com.jgmt.backend.util.Client;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
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
@Table(name = "rating")
public class Rating extends AbstractEntity {

    private Long accommodationid;
    private Long userid;
    private int rating;
    private String comment;
    @ManyToOne
    private Accommodation manyToOne;

}
