package com.jgmt.backend.accommodation.application.service;

import com.jgmt.backend.accommodation.infrastructure.controller.data.CreateAccommodationRequest;
import com.jgmt.backend.accommodation.infrastructure.controller.data.AccommodationResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Map;

public interface AccommodationServiceInterface {
    AccommodationResponse createAccommodation(CreateAccommodationRequest accommodation);

    AccommodationResponse getAccommodationById(Long id);

    Page<AccommodationResponse> getAllAccommodations(String city, Integer minPrice, Integer maxPrice, Pageable pageable);

    AccommodationResponse updateAccommodation(Long id, CreateAccommodationRequest accommodation);

    void deleteAccommodation(Long id);

    AccommodationResponse partialUpdateAccommodation(Long id, Map<String, Object> updates);

    Page<AccommodationResponse> searchAccommodations(String query, Pageable pageable);
}
