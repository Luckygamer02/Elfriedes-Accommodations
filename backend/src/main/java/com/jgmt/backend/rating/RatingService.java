package com.jgmt.backend.rating;

import com.jgmt.backend.accommodation.domain.Rating;
import com.jgmt.backend.accommodation.domain.repository.RatingRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class RatingService {
    @Autowired
    RatingRepository ratingRepository;

    @Transactional
    public Page<Rating> getratingforAcc(Long accommodationid, Pageable pageable) {
       return( ratingRepository.findByaccommodationId(accommodationid, pageable ) );
    }
    @Transactional
    public Optional<Rating> createRating(@Valid RatingDto rating) {
        Rating ratingEntity = new Rating(rating);
        return Optional.of(ratingRepository.save(ratingEntity));
    }
    @Transactional
    public Double getRating(Long accommodationid) {
        return  ratingRepository.getRatingforAccommodation(accommodationid);
    }
}
