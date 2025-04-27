package com.jgmt.backend.accommodation.domain.repository;


import com.jgmt.backend.accommodation.domain.Festival;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FestivalRepository extends JpaRepository<Festival, Long> {
}
