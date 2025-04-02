package com.jgmt.backend.accommodation.domain.repository;

import com.jgmt.backend.accommodation.domain.BookedExtra;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookedExtraRepository extends JpaRepository<BookedExtra, Long> {
}