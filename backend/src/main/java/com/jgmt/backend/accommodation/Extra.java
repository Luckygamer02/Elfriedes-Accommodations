package com.jgmt.backend.accommodation;

import com.jgmt.backend.accommodation.data.CreateExtraRequest;
import com.jgmt.backend.accommodation.enums.Extrastype;
import com.jgmt.backend.entity.AbstractEntity;
import com.jgmt.backend.util.Client;
import jakarta.persistence.*;
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
@Table(name = "extra")
public class Extra extends AbstractEntity {
    Extrastype type;
    int price;

    @ManyToOne
    @JoinColumn(name = "accommodation_id")  // Add this field
    private Accommodation accommodation;

    public Extra(CreateExtraRequest extraRequest) {
        this.type = extraRequest.getType();
        this.price = extraRequest.getPrice();
    }

    public Accommodation getAccommodation() {
        return accommodation;
    }

    public void setAccommodation(Accommodation accommodation) {
        this.accommodation = accommodation;
    }
}
