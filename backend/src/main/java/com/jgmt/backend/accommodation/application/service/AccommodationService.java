package com.jgmt.backend.accommodation.application.service;

import com.jgmt.backend.accommodation.domain.Accommodation;
import com.jgmt.backend.accommodation.domain.repository.RatingRepository;
import com.jgmt.backend.accommodation.infrastructure.controller.data.AccommodationResponse;
import com.jgmt.backend.accommodation.infrastructure.controller.data.CreateAccommodationRequest;
import com.jgmt.backend.accommodation.infrastructure.controller.data.UpdateAccommodation;
import com.jgmt.backend.accommodation.domain.repository.AccommodationRepository;
import com.jgmt.backend.auth.SecurityUtil;
import com.jgmt.backend.s3.UploadedFile;
import com.jgmt.backend.s3.repository.UploadedFileRepository;
import com.jgmt.backend.s3.services.FileUploadService;
import com.jgmt.backend.users.User;
import com.jgmt.backend.users.data.UserResponse;
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
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AccommodationService {

    private final AccommodationRepository accommodationRepository;
    private final UserRepository userRepository;
    private final RatingRepository ratingRepository;
    private final UploadedFileRepository uploadedFileRepository;
    private final FileUploadService fileUploadService;

    @Transactional
    public AccommodationResponse createAccommodation(@Valid CreateAccommodationRequest request) {
        Accommodation accommodation = new Accommodation(request);
        accommodation.setOwner(userRepository.getReferenceById(request.getOwnerId()));
        accommodation = accommodationRepository.save(accommodation);
        for(MultipartFile file : request.getPictures()){
            updateAccommodationPicture(file, accommodation.getId());
        };
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
    public Integer getRating(Long accommodationid) {
        return  ratingRepository.getRatingforAccommodation(accommodationid);

    }

    @Transactional
    public AccommodationResponse updateAccommodationPicture(MultipartFile file, Long accommodationId)  {
        User user = SecurityUtil.getAuthenticatedUser();
        Accommodation a = getAccommodation(accommodationId);

        UploadedFile uploadedFile = new UploadedFile(file.getOriginalFilename(), file.getSize(), user);
        try {

            String url = fileUploadService.uploadFile(
                    uploadedFile.buildPath("accommodationpicture"),
                    file.getBytes());
            uploadedFile.onUploaded(url);
            a.getPictures().add(uploadedFile);
            accommodationRepository.save(a);
            uploadedFileRepository.save(uploadedFile);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return new AccommodationResponse(a);
    }
}