package com.jgmt.backend.accommodation.application.service;

import com.jgmt.backend.accommodation.domain.Accommodation;
import com.jgmt.backend.accommodation.domain.repository.RatingRepository;
import com.jgmt.backend.accommodation.infrastructure.controller.data.AccommodationResponse;
import com.jgmt.backend.accommodation.infrastructure.controller.data.CreateAccommodationRequest;
import com.jgmt.backend.accommodation.infrastructure.controller.data.UpdateAccommodation;
import com.jgmt.backend.accommodation.domain.repository.AccommodationRepository;
import com.jgmt.backend.users.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AccommodationService {

    private final AccommodationRepository accommodationRepository;
    private final UserRepository userRepository;
    private final RatingRepository ratingRepository;

    @Transactional
    public AccommodationResponse createAccommodation(@Valid CreateAccommodationRequest request) {
        Accommodation accommodation = new Accommodation(request);
        accommodation.setOwner(userRepository.getReferenceById(request.getOwnerId()));
        accommodation = accommodationRepository.save(accommodation);
        return new AccommodationResponse(accommodation);
    }

    @Transactional(readOnly = true)
    public AccommodationResponse getAccommodationById(Long id) {
        return accommodationRepository.findById(id)
                .map(AccommodationResponse::new)
                .orElseThrow(() -> new EntityNotFoundException("Accommodation not found: " + id));
    }
    @Transactional
    public Accommodation getAccommodation(Long id) {
        return accommodationRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Accommodation not found: " + id));
    }

    @Transactional
    public AccommodationResponse updateAccommodation(Long id, @Valid UpdateAccommodation request) {
        Accommodation accommodation = accommodationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Accommodation not found: " + id));

        accommodation.updateFromRequest(request);
        return new AccommodationResponse(accommodationRepository.save(accommodation));
    }

    @Transactional
    public void deleteAccommodation(Long id) {
        accommodationRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public Page<AccommodationResponse> getAllAccommodations( String city, Integer minPrice, Integer maxPrice, Pageable pageable) {
        Page<Accommodation> accommodations;

        if (city != null || minPrice != null || maxPrice != null) {
            accommodations = accommodationRepository.findByFilters(city, minPrice, maxPrice, pageable);
        } else {
            accommodations = accommodationRepository.findAll(pageable);
        }

        return accommodations.map(AccommodationResponse::new);
    }

    @Transactional
    public AccommodationResponse partialUpdateAccommodation(Long id, Map<String, Object> updates) {
        Accommodation accommodation = accommodationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Accommodation not found: " + id));

        updates.forEach((key, value) -> {
            switch (key) {
                case "title" -> accommodation.setTitle((String) value);
                case "description" -> accommodation.setDescription((String) value);
                case "basePrice" -> accommodation.setBasePrice((Integer) value);
                // Add other fields...
                default -> throw new IllegalArgumentException("Invalid field: " + key);
            }
        });

        return new AccommodationResponse(accommodationRepository.save(accommodation));
    }

    @Transactional(readOnly = true)
    public Page<AccommodationResponse> searchAccommodations(String query, Pageable pageable) {
        return accommodationRepository.search(
                query.toLowerCase(),
                pageable
        ).map(AccommodationResponse::new);
    }

    public Page<AccommodationResponse> getAccommodationByOwnerId(Long id,  @PageableDefault(size = 100) Pageable pageable) {
        return accommodationRepository.findByOwnerId(id,pageable)
                .map(AccommodationResponse::new);
    }

    public Integer getRating(Long accommodationid) {
        return  ratingRepository.getRatingforAccommodation(accommodationid);

    }
}