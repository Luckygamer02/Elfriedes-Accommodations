package com.jgmt.backend.accommodation;

import com.jgmt.backend.entity.AbstractEntity;
import com.jgmt.backend.util.Client;
import jakarta.persistence.*;
import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Client
@Table(name = "accommodation")
public class Accommodation extends AbstractEntity {
    private String title;
    private String description;
    private int baseprice;

    private int bedrooms;
    private int bathrooms;
    private int people;
    private int livingRooms;


    private String descritption;
    private Type type;

    private Long featurelistid;
    
    @OneToOne()
    private Long adressid;

    @ManyToMany()
    private Long discountid;

    @ManyToOne
    private Long userid;

    @OneToOne
    private Long spezificationid;


}
