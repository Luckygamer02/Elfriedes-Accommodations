package com.jgmt.backend.accommodation;

import com.jgmt.backend.util.Client;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Client
@Table(name = "rating")
public class Rating {

    @ManyToOne
    private Long accommodationid;
    @OneToOne
    private Long userid;
    private int rating;
    private String comment;
}
