package com.jgmt.backend.accommodation;

import com.jgmt.backend.entity.AbstractEntity;
import com.jgmt.backend.util.Client;
import jakarta.persistence.*;
import lombok.*;

@Entity
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
    

    private Long adressid;


    private Long discountid;


    private Long userid;


    private Long spezificationid;


}
