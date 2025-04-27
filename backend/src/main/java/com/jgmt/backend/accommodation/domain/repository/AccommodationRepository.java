package com.jgmt.backend.accommodation.domain.repository;

import com.jgmt.backend.accommodation.domain.Accommodation;
import com.jgmt.backend.accommodation.domain.Festival;
import com.jgmt.backend.accommodation.domain.enums.AccommodationType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AccommodationRepository extends JpaRepository<Accommodation, Long> {
  @Query("SELECT a FROM Accommodation a WHERE " +
          "(:minPrice IS NULL OR a.basePrice >= :minPrice) AND " +
          "(:maxPrice IS NULL OR a.basePrice <= :maxPrice) AND " +
          "(:bedrooms IS NULL OR a.bedrooms = :bedrooms) AND " +
          "(:bathrooms IS NULL OR a.bathrooms = :bathrooms) AND " +
          "(:people IS NULL OR a.people = :people) AND " +
          "(:livingRooms IS NULL OR a.livingRooms = :livingRooms) AND " +
          "(:type IS NULL OR a.type = :type) AND " +
          "(:festivalistId IS NULL OR a.festivalistId = :festivalistId) AND " +
          "(:city IS NULL OR a.address.city LIKE %:city%) AND " +
          "(:postalCode IS NULL OR a.address.postalCode = :postalCode)")
  Page<Accommodation> findWithFilters(
          @Param("minPrice") Integer minPrice,
          @Param("maxPrice") Integer maxPrice,
          @Param("bedrooms") Integer bedrooms,
          @Param("bathrooms") Integer bathrooms,
          @Param("people") Integer people,
          @Param("livingRooms") Integer livingRooms,
          @Param("type") AccommodationType type,
          @Param("festivalistId") Long festivalistId,
          @Param("city") String city,
          @Param("postalCode") String postalCode,
          Pageable pageable
  );

  @Query("SELECT a FROM Accommodation a WHERE " +
          "LOWER(a.title) LIKE %:query% OR " +
          "LOWER(a.description) LIKE %:query% OR " +
          "LOWER(a.address.city) LIKE %:query%")
  Page<Accommodation> search(
          @Param("query") String query,
          Pageable pageable
  );


  Page<Accommodation> findByOwnerId(Long ownerId,
                                    Pageable pageable);
  @Query("select f from Accommodation a join Festival f on a.id = f.id where a.id = :accommodationId")
  List<Festival> findFestivalsByAccommodationId(@Param("accommodationId") Long accommodationId);
}