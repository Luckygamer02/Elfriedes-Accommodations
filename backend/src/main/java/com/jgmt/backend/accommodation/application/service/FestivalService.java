package com.jgmt.backend.accommodation.application.service;

import com.jgmt.backend.accommodation.domain.Festival;
import java.util.List;
import java.util.Optional;

/**
 * Service interface for managing Festival entities.
 */
public interface FestivalService {

    /**
     * Retrieve all festivals.
     *
     * @return a list of all festivals
     */
    List<Festival> findAllFestivals();

    /**
     * Find festivals associated with a specific accommodation.
     *
     * @param accommodationId the ID of the accommodation
     * @return a list of festivals for the given accommodation
     */
    List<Festival> findFestivalsByAccommodationId(Long accommodationId);

    /**
     * Find a festival by its ID.
     *
     * @param id the festival ID
     * @return an Optional containing the festival if found, or empty otherwise
     */
    Optional<Festival> findFestivalById(Long id);

    /**
     * Save a festival (create or update).
     *
     * @param festival the festival to save
     * @return the saved festival
     */
    Festival saveFestival(Festival festival);

    /**
     * Delete a festival by its ID.
     *
     * @param id the ID of the festival to delete
     */
    void deleteFestival(Long id);
}
