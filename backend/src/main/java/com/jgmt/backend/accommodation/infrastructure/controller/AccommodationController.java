package com.jgmt.backend.accommodation.infrastructure.controller;

import com.jgmt.backend.accommodation.infrastructure.controller.data.AccommodationResponse;
import com.jgmt.backend.accommodation.infrastructure.controller.data.CreateAccommodationRequest;
import com.jgmt.backend.accommodation.infrastructure.controller.data.UpdateAccommodation;
import com.jgmt.backend.accommodation.application.service.AccommodationService;
import com.jgmt.backend.util.Client;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/accommodations")
@Tag(name = "Accommodation Management", description = "Endpoints for managing accommodations")
@Client
public class AccommodationController {

    private final AccommodationService accommodationService;

    public AccommodationController(AccommodationService accommodationService) {
        this.accommodationService = accommodationService;
    }

    @PostMapping
    @Operation(summary = "Create new accommodation", description = "Create a new accommodation listing")
    @ApiResponse(responseCode = "201", description = "Accommodation created successfully")
    public ResponseEntity<AccommodationResponse> createAccommodation(
            @Valid @RequestBody CreateAccommodationRequest accommodation) {
        AccommodationResponse createdAccommodation = accommodationService.createAccommodation(accommodation);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdAccommodation);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single accommodation", description = "Get accommodation by ID")
    @ApiResponse(responseCode = "200", description = "Accommodation found")
    @ApiResponse(responseCode = "404", description = "Accommodation not found")
    public ResponseEntity<AccommodationResponse> getAccommodationById(
            @PathVariable Long id) {
        return ResponseEntity.ok(accommodationService.getAccommodationById(id));
    }

    @GetMapping
    @Operation(summary = "Get multiple accommodations", description = "Get paginated list of accommodations with optional filters")
    public ResponseEntity<Page<AccommodationResponse>> getAllAccommodations(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Integer minPrice,
            @RequestParam(required = false) Integer maxPrice,
            Pageable pageable) {
        return ResponseEntity.ok(accommodationService.getAllAccommodations( city, minPrice, maxPrice, pageable));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update accommodation", description = "Full update of existing accommodation")
    @ApiResponse(responseCode = "200", description = "Accommodation updated successfully")
    @ApiResponse(responseCode = "404", description = "Accommodation not found")
    public ResponseEntity<AccommodationResponse> updateAccommodation(
            @PathVariable Long id,
            @Valid @RequestBody UpdateAccommodation accommodation) {
        return ResponseEntity.ok(accommodationService.updateAccommodation(id, accommodation));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete accommodation", description = "Delete accommodation by ID")
    @ApiResponse(responseCode = "204", description = "Accommodation deleted successfully")
    public ResponseEntity<Void> deleteAccommodation(
            @PathVariable Long id) {
        accommodationService.deleteAccommodation(id);
        return ResponseEntity.noContent().build();
    }

    // Additional endpoints for partial updates and search
    @PatchMapping("/{id}")
    @Operation(summary = "Partial update accommodation", description = "Update specific fields of an accommodation")
    public ResponseEntity<AccommodationResponse> partialUpdateAccommodation(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {
        return ResponseEntity.ok(accommodationService.partialUpdateAccommodation(id, updates));
    }

    @GetMapping("/search")
    @Operation(summary = "Search accommodations", description = "Full-text search with multiple criteria")
    public ResponseEntity<Page<AccommodationResponse>> searchAccommodations(
            @RequestParam String query,
            Pageable pageable) {
        return ResponseEntity.ok(accommodationService.searchAccommodations(query, pageable));
    }
    @GetMapping("/getbyUserid/{ownerId}")
    public ResponseEntity<Page<AccommodationResponse>> getAccommodationByUserid(@PathVariable Long ownerId,  @PageableDefault(size = 100) Pageable pageable)
    {
        return ResponseEntity.ok(accommodationService.getAccommodationByOwnerId(ownerId, pageable));
    }
    @GetMapping("rating/{accommodationid}")
    public ResponseEntity<Integer> getRating(@PathVariable Long accommodationid) {
        return ResponseEntity.ok(accommodationService.getRating(accommodationid));
    }

}
