package com.jgmt.backend.accommodation;


import com.jgmt.backend.accommodation.data.CreateAccommodationRequest;
import com.jgmt.backend.accommodation.enums.AccommodationType;
import com.jgmt.backend.entity.AbstractEntity;
import com.jgmt.backend.users.User;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Table(name = "accommodation")
public class Accommodation extends AbstractEntity {

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 500)
    private String description;

    @Column(nullable = false)
    private int basePrice;

    private int bedrooms;
    private int bathrooms;
    private int people;
    private int livingRooms;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccommodationType type;

    @Column(name = "festivalist_id")
    private Long festivalistId;

    // Relationships
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "address_id", referencedColumnName = "id")
    private Address address;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "feature_id", referencedColumnName = "id")
    private AccommodationFeature features;

    @OneToMany(
            mappedBy = "accommodation",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    private List<AppliedDiscount> appliedDiscounts = new ArrayList<>();

    @OneToMany(
            mappedBy = "accommodation",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    private List<Extra> extras = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    // Bidirectional relationship with Booking
    @OneToMany(
            mappedBy = "accommodation",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    private List<Booking> bookings = new ArrayList<>();


    public Accommodation(@Valid CreateAccommodationRequest request) {
        this.title = request.getTitle();
        this.description = request.getDescription();
        this.basePrice = request.getBasePrice();
        this.bedrooms = request.getBedrooms();
        this.bathrooms = request.getBathrooms();
        this.people = request.getPeople();
        this.livingRooms = request.getLivingRooms();
        this.type = request.getType();
        this.festivalistId = request.getFestivalistId();
    }
}