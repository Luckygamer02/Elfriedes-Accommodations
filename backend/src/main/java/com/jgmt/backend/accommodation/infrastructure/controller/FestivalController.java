package com.jgmt.backend.accommodation.infrastructure.controller;



import com.jgmt.backend.accommodation.application.service.FestivalService;
import com.jgmt.backend.accommodation.domain.Festival;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/festivals")
public class FestivalController {

    private final FestivalService festivalService;

    @Autowired
    public FestivalController(FestivalService festivalService) {
        this.festivalService = festivalService;
    }

    @GetMapping
    public ResponseEntity<List<Festival>> getAllFestivals() {
        return ResponseEntity.ok(festivalService.findAllFestivals());
    }

    @GetMapping("/accommodation/{accommodationId}")
    public ResponseEntity<List<Festival>> getFestivalsByAccommodationId(@PathVariable Long accommodationId) {
        return ResponseEntity.ok(festivalService.findFestivalsByAccommodationId(accommodationId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Festival> getFestivalById(@PathVariable Long id) {
        return festivalService.findFestivalById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Festival> createFestival(@RequestBody Festival festival) {
        if (festival.getEndDate().isBefore(festival.getStartDate())) {
            throw new IllegalArgumentException("End date must be after start date");
        }
        Festival createdFestival = festivalService.saveFestival(festival);
        return new ResponseEntity<>(createdFestival, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Festival> updateFestival(@PathVariable Long id, @RequestBody Festival festival) {
        if (!id.equals(festival.getId())) {
            return ResponseEntity.badRequest().build();
        }

        return festivalService.findFestivalById(id)
                .map(existingFestival -> ResponseEntity.ok(festivalService.saveFestival(festival)))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFestival(@PathVariable Long id) {
        return festivalService.findFestivalById(id)
                .map(festival -> {
                    festivalService.deleteFestival(id);
                    return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}