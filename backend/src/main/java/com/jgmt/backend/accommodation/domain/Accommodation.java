package com.jgmt.backend.accommodation.domain;



import com.jgmt.backend.accommodation.domain.enums.AccommodationType;
import com.jgmt.backend.accommodation.infrastructure.controller.data.CreateAccommodationRequest;
import com.jgmt.backend.accommodation.infrastructure.controller.data.CreateAppliedDiscountRequest;
import com.jgmt.backend.accommodation.infrastructure.controller.data.CreateExtraRequest;
import com.jgmt.backend.accommodation.infrastructure.controller.data.UpdateAccommodation;
import com.jgmt.backend.entity.AbstractEntity;
import com.jgmt.backend.users.User;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
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

    @Positive
    @Column(nullable = false, name = "baseprice")
    private int basePrice;
    @Positive
    private int bedrooms;
    @Positive
    private int bathrooms;
    @Positive
    private int people;

    @Positive
    @Column(nullable = false,name = "living_rooms")
    private int livingRooms;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccommodationType type;

    @Column(name = "festivalist_id")
    private Long festivalistId;


    @Embedded
    private Address address;

    @Embedded
    private AccommodationFeature features;

    @OneToMany(
            mappedBy = "accommodation",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    private List<AppliedDiscount> appliedDiscounts = new ArrayList<>();


    @OneToMany(mappedBy = "accommodation")
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


    public void updateFromRequest(@Valid UpdateAccommodation request) {
    }

    public void addExtra(Extra extra) {
        extras.add(extra);
        extra.setAccommodation(this);
    }

    public void removeExtra(Extra extra) {
        extras.remove(extra);
        extra.setAccommodation(null);
    }
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
        this.address = new Address(request.getAddress());
        this.features = new AccommodationFeature(request.getFeatures());

        // Convert Applied Discounts
        this.appliedDiscounts = new ArrayList<>();
        if (request.getAppliedDiscounts() != null) {
            for (CreateAppliedDiscountRequest discountRequest : request.getAppliedDiscounts()) {
                AppliedDiscount discount = new AppliedDiscount(discountRequest);
                discount.setAccommodation(this);
                this.appliedDiscounts.add(discount);
            }
        }

        // Convert Extras
        this.extras = new ArrayList<>();
        if (request.getExtras() != null) {
            for (CreateExtraRequest extraRequest : request.getExtras()) {
                Extra extra = new Extra(extraRequest);
                extra.setAccommodation(this);
                this.extras.add(extra);
            }
        }
    }
}