package com.jgmt.backend.accommodation.repository;

import com.jgmt.backend.accommodation.Accommodation;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface AccommodationRepository extends JpaRepository<Accommodation, Long> {
  @Query("SELECT a FROM Accommodation a WHERE " +
          "(:city IS NULL OR a.address.city = :city) AND " +
          "(:minPrice IS NULL OR a.basePrice >= :minPrice) AND " +
          "(:maxPrice IS NULL OR a.basePrice <= :maxPrice)")
  Page<Accommodation> findByFilters(
          @Param("city") String city,
          @Param("minPrice") Integer minPrice,
          @Param("maxPrice") Integer maxPrice,
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
  @Query("SELECT a FROM Accommodation a " +
          "LEFT JOIN FETCH a.address " +
          "LEFT JOIN FETCH a.features " +
          "LEFT JOIN FETCH a.appliedDiscounts " +
          "LEFT JOIN FETCH a.extras " +
          "WHERE a.id = :id")
  Optional<Accommodation> findByIdWithRelations(@Param("id") Long id);

}