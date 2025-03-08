package com.jgmt.backend.accommodation.data;

import com.jgmt.backend.accommodation.Type;
import com.jgmt.backend.util.Client;
import com.jgmt.backend.util.validators.PasswordMatch;
import com.jgmt.backend.util.validators.Unique;
import jakarta.annotation.Nullable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
@Builder
@Client
public class CreateAccommodationRequest {

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





}
