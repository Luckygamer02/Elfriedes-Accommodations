package com.jgmt.backend.accommodation.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.jgmt.backend.accommodation.domain.enums.FestivalType;
import com.jgmt.backend.entity.AbstractEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "festivals")
@Getter
@Setter
@NoArgsConstructor
public class Festival extends AbstractEntity {

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "festival_type", nullable = false)
    @JsonProperty("festivalType")  // Explicit JSON mapping
    private FestivalType festivalType;


    public Festival(String id, String name, LocalDate startDate, LocalDate endDate, FestivalType festivalType) {
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.festivalType = festivalType;
    }

}
