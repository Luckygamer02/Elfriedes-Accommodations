package com.jgmt.backend.accommodation.application.service;

import com.jgmt.backend.accommodation.domain.Accommodation;
import com.jgmt.backend.accommodation.domain.Extra;
import com.jgmt.backend.accommodation.domain.Festival;
import com.jgmt.backend.accommodation.domain.Extratype;
import com.jgmt.backend.accommodation.domain.enums.AccommodationType;
import com.jgmt.backend.accommodation.domain.enums.FestivalType;
import com.jgmt.backend.accommodation.domain.repository.FestivalRepository;
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
import org.springframework.data.domain.*;
import org.springframework.data.web.PageableDefault;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.lang.reflect.Field;
import java.util.*;
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
    private final FestivalRepository festivalRepository;

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

    public Page<AccommodationResponse> searchWithFilters(FilterAccommodationDTO req) {
        // Default pagination values if not provided
        int page = req.getPage() != null ? req.getPage() : 0;
        int size = req.getSize() != null ? req.getSize() : 20;

        // Create pageable with sorting based on sortBy parameter
        Pageable pageable = createPageable(req.getSortBy(), page, size);

        // If we have a complex query with ratings or name search, use custom filtering
        if (req.getMinRating() != null || req.getMaxRating() != null || req.getName() != null) {
            return searchWithCustomFilters(req, pageable);
        }

        // Otherwise, use JPA repository methods directly if possible
        if (canUseRepositoryMethod(req)) {
            return searchWithRepositoryMethod(req, pageable);
        }

        // Fall back to manual filtering for complex queries
        return searchWithManualFiltering(req, pageable);
    }

    private boolean canUseRepositoryMethod(FilterAccommodationDTO req) {
        // Check if we can use repository method (simple query without complex filters)
        return req.getExtras() == null && req.getFeatures() == null &&
                req.getFestivalType() == null;
    }

    private Page<AccommodationResponse> searchWithRepositoryMethod(FilterAccommodationDTO req, Pageable pageable) {
        // Use repository method for better performance with simple queries
        Page<Accommodation> accommodations = accommodationRepository.findWithFilters(
                req.getMinBasePrice(), req.getMaxBasePrice(),
                req.getBedrooms(), req.getBathrooms(), req.getPeople(), req.getLivingRooms(),
                req.getType(), req.getFestivalistId(), req.getCity(), req.getPostalCode(),
                pageable
        );

        return accommodations.map(acc -> mapToResponse(acc));
    }

    private Page<AccommodationResponse> searchWithCustomFilters(FilterAccommodationDTO req, Pageable pageable) {
        // For complex queries with ratings or name search, we need custom filtering
        List<Accommodation> allAccommodations = accommodationRepository.findAll();

        // Apply all filters manually
        List<Accommodation> filteredAccommodations = allAccommodations.stream()
                .filter(acc -> filterByBasePrice(acc, req.getMinBasePrice(), req.getMaxBasePrice()))
                .filter(acc -> filterByRooms(acc, req.getBedrooms(), req.getBathrooms(), req.getPeople(), req.getLivingRooms()))
                .filter(acc -> filterByType(acc, req.getType()))
                .filter(acc -> filterByFestival(acc, req.getFestivalistId(), req.getFestivalType()))
                .filter(acc -> filterByLocation(acc, req.getCity(), req.getPostalCode()))
                .filter(acc -> filterByExtras(acc, req.getExtras()))
                .filter(acc -> filterByFeatures(acc, req.getFeatures()))
                .filter(acc -> filterByName(acc, req.getName()))
                .filter(acc -> filterByRating(acc, req.getMinRating(), req.getMaxRating()))
                .collect(Collectors.toList());

        // Apply sorting
        applySorting(filteredAccommodations, req.getSortBy());

        // Apply pagination manually
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), filteredAccommodations.size());

        if (start >= filteredAccommodations.size()) {
            return new PageImpl<>(Collections.emptyList(), pageable, filteredAccommodations.size());
        }

        List<Accommodation> pageContent = filteredAccommodations.subList(start, end);
        return new PageImpl<>(
                pageContent.stream().map(this::mapToResponse).collect(Collectors.toList()),
                pageable,
                filteredAccommodations.size()
        );
    }

    private Page<AccommodationResponse> searchWithManualFiltering(FilterAccommodationDTO req, Pageable pageable) {
        // For queries with extras or features, we need manual filtering
        List<Accommodation> allAccommodations = accommodationRepository.findAll();

        List<Accommodation> filteredAccommodations = allAccommodations.stream()
                .filter(acc -> filterByBasePrice(acc, req.getMinBasePrice(), req.getMaxBasePrice()))
                .filter(acc -> filterByRooms(acc, req.getBedrooms(), req.getBathrooms(), req.getPeople(), req.getLivingRooms()))
                .filter(acc -> filterByType(acc, req.getType()))
                .filter(acc -> filterByFestival(acc, req.getFestivalistId(), req.getFestivalType()))
                .filter(acc -> filterByLocation(acc, req.getCity(), req.getPostalCode()))
                .filter(acc -> filterByExtras(acc, req.getExtras()))
                .filter(acc -> filterByFeatures(acc, req.getFeatures()))
                .collect(Collectors.toList());

        // Apply sorting
        applySorting(filteredAccommodations, req.getSortBy());

        // Apply pagination manually
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), filteredAccommodations.size());

        if (start >= filteredAccommodations.size()) {
            return new PageImpl<>(Collections.emptyList(), pageable, filteredAccommodations.size());
        }

        List<Accommodation> pageContent = filteredAccommodations.subList(start, end);
        return new PageImpl<>(
                pageContent.stream().map(this::mapToResponse).collect(Collectors.toList()),
                pageable,
                filteredAccommodations.size()
        );
    }

    private Pageable createPageable(String sortBy, int page, int size) {
        if (sortBy == null) {
            return PageRequest.of(page, size);
        }

        // Parse sorting parameter
        Sort sort;
        switch (sortBy) {
            case "price_asc":
                sort = Sort.by(Sort.Direction.ASC, "basePrice");
                break;
            case "price_desc":
                sort = Sort.by(Sort.Direction.DESC, "basePrice");
                break;
            case "rating_asc":
                sort = Sort.by(Sort.Direction.ASC, "averageRating");
                break;
            case "rating_desc":
                sort = Sort.by(Sort.Direction.DESC, "averageRating");
                break;
            case "newest":
                sort = Sort.by(Sort.Direction.DESC, "createdAt");
                break;
            default:
                sort = Sort.by(Sort.Direction.ASC, "basePrice");
        }

        return PageRequest.of(page, size, sort);
    }

    private void applySorting(List<Accommodation> accommodations, String sortBy) {
        if (sortBy == null) {
            return;
        }

        // Apply sorting based on parameter
        switch (sortBy) {
            case "price_asc":
                accommodations.sort(Comparator.comparing(Accommodation::getBasePrice));
                break;
            case "price_desc":
                accommodations.sort(Comparator.comparing(Accommodation::getBasePrice).reversed());
                break;
            case "rating_asc":
                accommodations.sort(Comparator.comparing(this::getAverageRating));
                break;
            case "rating_desc":
                accommodations.sort(Comparator.comparing(this::getAverageRating).reversed());
                break;
            case "newest":
                accommodations.sort(Comparator.comparing(Accommodation::getCreatedAt).reversed());
                break;
        }
    }

    private Double getAverageRating(Accommodation accommodation) {
        return ratingRepository.getRatingforAccommodation(accommodation.getId());
    }

    // Filter helper methods
    private boolean filterByBasePrice(Accommodation acc, Integer minPrice, Integer maxPrice) {
        if (minPrice != null && acc.getBasePrice() < minPrice) {
            return false;
        }
        if (maxPrice != null && acc.getBasePrice() > maxPrice) {
            return false;
        }
        return true;
    }

    private boolean filterByRooms(Accommodation acc, Integer bedrooms, Integer bathrooms, Integer people, Integer livingRooms) {
        if (bedrooms != null && acc.getBedrooms() != bedrooms) {
            return false;
        }
        if (bathrooms != null && acc.getBathrooms() != bathrooms) {
            return false;
        }
        if (people != null && acc.getPeople() != people) {
            return false;
        }
        if (livingRooms != null && acc.getLivingRooms() != livingRooms) {
            return false;
        }
        return true;
    }

    private boolean filterByType(Accommodation acc, AccommodationType type) {
        return type == null || acc.getType() == type;
    }

    private boolean filterByFestival(Accommodation acc, Long festivalistId, FestivalType festivalType) {
        if (festivalistId != null && !acc.getFestivalistId().equals(festivalistId)) {
            return false;
        }

        if (festivalType != null) {
            // This requires linking to festival data to check festival type
            // Assuming there's a method to get festival by id
            Festival festival = festivalRepository.findById(acc.getFestivalistId()).orElse(null);
            if (festival == null || festival.getFestivalType() != festivalType) {
                return false;
            }
        }

        return true;
    }

    private boolean filterByLocation(Accommodation acc, String city, String postalCode) {
        if (city != null && !city.isEmpty()) {
            if (acc.getAddress() == null ||
                    acc.getAddress().city() == null ||
                    !acc.getAddress().city().toLowerCase().contains(city.toLowerCase())) {
                return false;
            }
        }

        if (postalCode != null && !postalCode.isEmpty()) {
            if (acc.getAddress() == null ||
                    acc.getAddress().postalCode() == null ||
                    !acc.getAddress().postalCode().equals(postalCode)) {
                return false;
            }
        }

        return true;
    }

    private boolean filterByExtras(Accommodation acc, List<String> extras) {
        if (extras == null || extras.isEmpty()) {
            return true;
        }

        if (acc.getExtras() == null || acc.getExtras().isEmpty()) {
            return false;
        }

        // Convert extras to Extrastype enum values
        List<Extratype> requestedExtras = extras.stream()
                .map(ext -> {
                    try {
                        return Extratype.valueOf(ext);
                    } catch (IllegalArgumentException e) {
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        // Check if accommodation has all requested extras
        return acc.getExtras().stream()
                .map(Extra::getType)
                .collect(Collectors.toList())
                .containsAll(requestedExtras);
    }

    private boolean filterByFeatures(Accommodation acc, List<String> features) {
        if (features == null || features.isEmpty()) {
            return true;
        }

        if (acc.getFeatures() == null) {
            return false;
        }

        // Use reflection to check if accommodation has all requested features
        return features.stream().allMatch(feature -> {
            try {
                Field field = acc.getFeatures().getClass().getDeclaredField(feature);
                field.setAccessible(true);
                return (boolean) field.get(acc.getFeatures());
            } catch (NoSuchFieldException | IllegalAccessException e) {
                return false;
            }
        });
    }

    private boolean filterByName(Accommodation acc, String name) {
        if (name == null || name.isEmpty()) {
            return true;
        }

        return acc.getTitle() != null &&
                acc.getTitle().toLowerCase().contains(name.toLowerCase());
    }

    private boolean filterByRating(Accommodation acc, Float minRating, Float maxRating) {
        if (minRating == null && maxRating == null) {
            return true;
        }

        Double avgRating = getAverageRating(acc);

        if (minRating != null && avgRating < minRating) {
            return false;
        }

        if (maxRating != null && avgRating > maxRating) {
            return false;
        }

        return true;
    }

    private AccommodationResponse mapToResponse(Accommodation accommodation) {
        AccommodationResponse response = new AccommodationResponse(accommodation);

        // Add average rating to response
        Double avgRating = getAverageRating(accommodation);
        response.setAvgRating(avgRating != null ? avgRating : 0.0f);

        return response;
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