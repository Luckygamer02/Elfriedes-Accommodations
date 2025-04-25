package com.jgmt.backend.accommodation.application.service;

import com.jgmt.backend.accommodation.domain.Accommodation;
import com.jgmt.backend.accommodation.domain.repository.RatingRepository;
import com.jgmt.backend.accommodation.infrastructure.controller.data.AccommodationResponse;
import com.jgmt.backend.accommodation.infrastructure.controller.data.CreateAccommodationRequest;
import com.jgmt.backend.accommodation.infrastructure.controller.data.UpdateAccommodation;
import com.jgmt.backend.accommodation.domain.repository.AccommodationRepository;
import com.jgmt.backend.accommodation.infrastructure.controller.data.FilterAccommodationDTO;
import com.jgmt.backend.auth.SecurityUtil;
import com.jgmt.backend.s3.UploadedFile;
import com.jgmt.backend.s3.repository.UploadedFileRepository;
import com.jgmt.backend.s3.services.FileUploadService;
import com.jgmt.backend.users.User;
import com.jgmt.backend.users.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.Locale.filter;

@Service
@RequiredArgsConstructor
public class AccommodationService {

    private final AccommodationRepository accommodationRepository;
    private final UserRepository userRepository;
    private final RatingRepository ratingRepository;
    private final UploadedFileRepository uploadedFileRepository;
    private final FileUploadService fileUploadService;

    @Transactional
    public AccommodationResponse createAccommodation(@Valid CreateAccommodationRequest request, List<MultipartFile> files) {
        // Validate files first
        if (files == null || files.isEmpty()) {
            throw new IllegalArgumentException("At least one image is required");
        }

        // Create and save accommodation
        Accommodation accommodation = new Accommodation(request);
        accommodation.setOwner(userRepository.getReferenceById(request.getOwnerId()));
        accommodation = accommodationRepository.save(accommodation);

        // Process files using existing picture update logic
        for(MultipartFile file : files) {
            if (file.isEmpty()) {
                throw new IllegalArgumentException("Uploaded file is empty");
            }
            updateAccommodationPicture(file, accommodation.getId());
        }

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

        accommodation =  accommodation.updateFromRequest(request);
        return new AccommodationResponse(accommodationRepository.save(accommodation));
    }

    @Transactional
    public void deleteAccommodation(Long id) {
        accommodationRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public Page<AccommodationResponse> getAllAccommodations( Pageable pageable) {
        Page<Accommodation> accommodations;
        accommodations = accommodationRepository.findAll(pageable);
        return accommodations.map(AccommodationResponse::new);
    }

    @Transactional
    public AccommodationResponse partialUpdateAccommodation(Long id, UpdateAccommodation accommodationupdates) {
        Accommodation accommodation = accommodationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Accommodation not found: " + id));
        accommodation.updateFromRequest(accommodationupdates);
        accommodation = accommodationRepository.save(accommodation);
        return new AccommodationResponse(accommodation);
    }

    @Transactional(readOnly = true)
    public Page<AccommodationResponse> searchAccommodations(String query, Pageable pageable) {
        return accommodationRepository.search(
                query.toLowerCase(),
                pageable
        ).map(AccommodationResponse::new);
    }
    @Transactional
    public Page<AccommodationResponse> getAccommodationByOwnerId(Long id,  @PageableDefault(size = 100) Pageable pageable) {
        return accommodationRepository.findByOwnerId(id,pageable)
                .map(AccommodationResponse::new);
    }


    @Transactional
    public AccommodationResponse updateAccommodationPicture(MultipartFile file, Long accommodationId) {
        User user = SecurityUtil.getAuthenticatedUser();
        Accommodation a = getAccommodation(accommodationId);

        // 1. Create NEW uploaded file with unique identifier
        UploadedFile uploadedFile = new UploadedFile(
                file.getOriginalFilename(),
                file.getSize(),
                user
        );

        try {
            String url = fileUploadService.uploadFile(
                    uploadedFile.buildPath("accommodationpicture"),
                    file.getBytes()
            );
            uploadedFile.onUploaded(url);

            // 2. Initialize list if null
            if (a.getPictures() == null) {
                a.setPictures(new ArrayList<>());
            }

            // 3. Add ONLY ONCE
            a.getPictures().add(url);

            // 4. Save both entities
            accommodationRepository.save(a);
            uploadedFileRepository.save(uploadedFile);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return new AccommodationResponse(a);
    }


    public List<AccommodationResponse> searchWithFilters(FilterAccommodationDTO req) {
        // 1. alle Unterkünfte laden
        List<Accommodation> all = accommodationRepository.findAll();
        //2. Stream-Filter nach allen non-null-Feldern im Request
                return all.stream()
                        .filter(acc -> req.getMinBasePrice() == null || acc.getBasePrice() >= req.getMinBasePrice())
                        .filter(acc -> req.getMaxBasePrice() == null || acc.getBasePrice() <= req.getMaxBasePrice())
                        .filter(acc -> req.getBedrooms() == null    || acc.getBedrooms() == req.getBedrooms())
                        .filter(acc -> req.getBathrooms() == null   || acc.getBathrooms() == req.getBathrooms())
                        .filter(acc -> req.getPeople() == null      || acc.getPeople() == req.getPeople())
                        .filter(acc -> req.getType() == null        || acc.getType() == req.getType())
                        .map(AccommodationResponse::new)
                        .collect(Collectors.toList());
    }

    /**
     * Remove the image at the given index from the accommodation's picture list.
     */
    @Transactional
    public AccommodationResponse deleteAccommodationImage(Long accommodationId, int index) {
        // 1) Load or throw
        Accommodation acc = accommodationRepository.findById(accommodationId)
                .orElseThrow(() -> new EntityNotFoundException("Accommodation not found: " + accommodationId));

        List<String> pics = acc.getPictures();
        if (pics == null || index < 0 || index >= pics.size()) {
            throw new EntityNotFoundException("No image at index " + index);
        }

        // 2) Remove from the list
        String removedUrl = pics.remove(index);

        // 3) Persist the updated accommodation
        accommodationRepository.save(acc);

        // 4) (Optional) delete file from S3 and UploadedFile record if you track those
        // fileUploadService.deleteFile(removedUrl);
        // uploadedFileRepository.deleteByUrl(removedUrl);

        // 5) Return the updated DTO
        return new AccommodationResponse(acc);
    }
}