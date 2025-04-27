package com.jgmt.backend.accommodation.application.service;

import com.jgmt.backend.accommodation.domain.Festival;
import com.jgmt.backend.accommodation.domain.repository.AccommodationRepository;
import com.jgmt.backend.accommodation.domain.repository.FestivalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FestivalServiceImpl implements FestivalService {

    private final FestivalRepository festivalRepository;
    private final AccommodationRepository accommodationRepository;

    @Autowired
    public FestivalServiceImpl(FestivalRepository festivalRepository, AccommodationRepository accommodationRepository) {
        this.festivalRepository = festivalRepository;
        this.accommodationRepository = accommodationRepository;
    }

    @Override
    public List<Festival> findAllFestivals() {
        return festivalRepository.findAll();
    }

    @Override
    public List<Festival> findFestivalsByAccommodationId(Long accommodationId) {
        return accommodationRepository.findFestivalsByAccommodationId(accommodationId);
    }

    @Override
    public Optional<Festival> findFestivalById(Long id) {
        return festivalRepository.findById(id);
    }

    @Override
    public Festival saveFestival(Festival festival) {
        return festivalRepository.save(festival);
    }

    @Override
    public void deleteFestival(Long id) {
        festivalRepository.deleteById(id);
    }
}