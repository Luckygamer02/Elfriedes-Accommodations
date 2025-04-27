package com.jgmt.backend.accommodation.infrastructure.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.jgmt.backend.accommodation.domain.Accommodation;
import com.jgmt.backend.accommodation.domain.Extra;
import com.jgmt.backend.accommodation.domain.enums.AccommodationType;
import com.jgmt.backend.accommodation.infrastructure.controller.data.AccommodationResponse;
import com.jgmt.backend.accommodation.infrastructure.controller.data.CreateAccommodationRequest;
import com.jgmt.backend.accommodation.infrastructure.controller.data.FilterAccommodationDTO;
import com.jgmt.backend.accommodation.infrastructure.controller.data.UpdateAccommodation;
import com.jgmt.backend.accommodation.application.service.AccommodationService;
import com.jgmt.backend.users.data.UserResponse;
import com.jgmt.backend.util.Client;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/accommodations")
@Tag(name = "Accommodation Management", description = "Endpoints for managing accommodations")
@Client
public class AccommodationController {

    private final AccommodationService accommodationService;

    public AccommodationController(AccommodationService accommodationService) {
        this.accommodationService = accommodationService;
    }

    @PostMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<AccommodationResponse> createAccommodation(
            @RequestPart("data") String dataJson,
            @RequestPart("files") List<MultipartFile> files) throws JsonProcessingException {
        // Configure ObjectMapper with JavaTimeModule
        ObjectMapper objectMapper = new ObjectMapper()
                .registerModule(new JavaTimeModule())
                .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        CreateAccommodationRequest accommodation =
                objectMapper.readValue(dataJson, CreateAccommodationRequest.class);

        AccommodationResponse createdAccommodation =
                accommodationService.createAccommodation(accommodation, files);

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
            Pageable pageable) {
        return ResponseEntity.ok(accommodationService.getAllAccommodations( pageable));
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
            @RequestBody UpdateAccommodation accommodation ) {
        return ResponseEntity.ok(accommodationService.partialUpdateAccommodation(id, accommodation));
    }

    @GetMapping("/search")
    @Operation(summary = "Search accommodations", description = "Search with filters")
    public ResponseEntity<Page<AccommodationResponse>> searchAccommodations(
            @ModelAttribute FilterAccommodationDTO filter
    ) {
        Page<AccommodationResponse> result = accommodationService.searchWithFilters(filter);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/getbyUserid/{ownerId}")
    public ResponseEntity<Page<AccommodationResponse>> getAccommodationByUserid(@PathVariable Long ownerId,  @PageableDefault(size = 100) Pageable pageable)
    {
        return ResponseEntity.ok(accommodationService.getAccommodationByOwnerId(ownerId, pageable));
    }

    @PatchMapping("/{id}/profile-picture")
    public ResponseEntity<AccommodationResponse> updateProfilePicture(
            @PathVariable Long id, @RequestParam("file") MultipartFile file) {
        AccommodationResponse accommodation = accommodationService.updateAccommodationPicture( file, id);
        return ResponseEntity.ok(accommodation);
    }

    /**
     * Upload a new image file for the given accommodation.
     * Matches front-end PATCH /api/accommodations/{id}/image
     */
    @PatchMapping(
            path = "/{id}/image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    @Operation(summary = "Upload accommodation image", description = "Add one image to an accommodation")
    public ResponseEntity<AccommodationResponse> uploadImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        AccommodationResponse updated = accommodationService.updateAccommodationPicture(file, id);
        return ResponseEntity.ok(updated);
    }

    /**
     * Delete a single image by its position in the list.
     * Matches front-end DELETE /api/accommodations/{id}/images/{index}
     */
    @DeleteMapping("/{id}/images/{index}")
    @Operation(summary = "Delete accommodation image", description = "Remove one image from an accommodation by index")
    @ApiResponse(responseCode = "200", description = "Image removed and accommodation returned")
    public ResponseEntity<AccommodationResponse> deleteImage(
            @PathVariable Long id,
            @PathVariable int index) {
        AccommodationResponse updated = accommodationService.deleteAccommodationImage(id, index);
        return ResponseEntity.ok(updated);
    }

}
