package com.jgmt.backend.rating;

import com.jgmt.backend.accommodation.domain.Rating;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ratings")
public class ratingcontroller {

    @Autowired
    RatingService ratingService;


    @GetMapping("/{accommodationid}")
    public ResponseEntity<Page<Rating>> getRatings(@PathVariable Long accommodationid , Pageable pageable) {
        return ResponseEntity.ok(ratingService.getratingforAcc( accommodationid , pageable ));
    }

    @PostMapping
    public ResponseEntity<Rating> createRating(@RequestBody  RatingDto rating) {
        return ResponseEntity.of(ratingService.createRating(rating));
    }

    @GetMapping("rating/{accommodationid}")
    public ResponseEntity<Integer> getRating(@PathVariable Long accommodationid) {
        return ResponseEntity.ok(ratingService.getRating(accommodationid));
    }


}
